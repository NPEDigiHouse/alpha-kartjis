import { Router } from "express";
import { OrderHandler } from "./handler";

export class OrderRouter {
  handler: OrderHandler;
  path: string;
  router: Router;

  constructor() {
    this.path = "/orders";
    this.router = Router();
    this.handler = new OrderHandler();
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
