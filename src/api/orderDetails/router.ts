import { Router } from 'express';
import { OrderDetailHandler } from './handler';

export class OrderDetailRouter {
  handler: OrderDetailHandler;
  path: string;
  router: Router;

  constructor() {
    this.path = '/order-details';
    this.router = Router();
    this.handler = new OrderDetailHandler();
  }

  register() {
    // * /orders
    this.router
      .route(this.path + '/:orderDetailId')
      .get(this.handler.getOrderDetailDetail);

    this.router
      .route(this.path + '/master/:eventId')
      .get(this.handler.getOrderDetails);

    this.router
      .route(this.path + '/:eventId/event-data')
      .get(this.handler.getOrderDetailByEvent);

    this.router
      .route(this.path + '/:eventId/offline-channel')
      .get(this.handler.getOfflineTicket);

    return this.router;
  }
}
