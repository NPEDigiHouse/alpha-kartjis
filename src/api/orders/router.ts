import { Router } from "express";
import { OrderHandler } from "./handler";
import { EmailHelper } from "../../helper/EmailHelper";
import { TicketConstruction } from "../../services/facade/ticketConstruction";

export class OrderRouter {
  handler: OrderHandler;
  path: string;
  router: Router;

  constructor(emailHelper: EmailHelper, ticketConstruction: TicketConstruction) {
    this.path = "/orders";
    this.router = Router();
    this.handler = new OrderHandler(emailHelper, ticketConstruction);
  }

  register() {
    // * /orders
    // * PUT method is just for testing only
    this.router
      .route(this.path + "/:orderId")
      .get(this.handler.getOrderDetail)
      .put(this.handler.putOrder);

    // * resend email to list of orders
    this.router.route(this.path + "/:orderId/emails").post(this.handler.postEmailOrders)
    .put(this.handler.putEmailOrderPending)

    // * get order details from order id
    this.router
      .route(this.path + "/:orderId/order-details")
      .get(this.handler.getOrderOrderDetails);

    return this.router;
  }
}
