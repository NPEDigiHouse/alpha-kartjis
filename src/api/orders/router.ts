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

    return this.router;
  }
}
