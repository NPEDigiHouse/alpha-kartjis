import { Request, Response, NextFunction } from "express";
import { OrderService } from "../../services/database/order";
import { constants, createResponse } from "../../utils";
import { PaymentService } from "../../services/database/payment";

export class OrderHandler {
  orderService: OrderService;
  paymentService: PaymentService;

  constructor() {
    this.orderService = new OrderService();
    this.paymentService = new PaymentService();

    this.getOrderDetail = this.getOrderDetail.bind(this);
    this.putOrder = this.putOrder.bind(this);
  }

  // * this will use flip as payment gateway
  // * then if success customers will be sent ticket as a link to their email
  async putOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderId } = req.params;

      const bill = await this.paymentService.payOrder(orderId);

      return res.json(createResponse(constants.SUCCESS_RESPONSE_MESSAGE, bill));
    } catch (error) {
      return next(error);
    }
  }

  async getOrderDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderId } = req.params;

      const order = await this.orderService.getOrderDetail(orderId);

      return res.json(
        createResponse(constants.SUCCESS_RESPONSE_MESSAGE, order)
      );
    } catch (error) {
      return next(error);
    }
  }
}
