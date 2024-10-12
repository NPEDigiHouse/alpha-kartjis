import { Request, Response, NextFunction } from "express";
import { OrderService } from "../../services/database/order";
import { constants, createResponse } from "../../utils";
import { PaymentService } from "../../services/facade/payment";
import { OrderDetailService } from "../../services/database/orderDetail";

export class OrderHandler {
  
  private orderService: OrderService;
  private paymentService: PaymentService;
  private orderDetailService: OrderDetailService;

  constructor() {
    this.orderService = new OrderService();
    this.orderDetailService = new OrderDetailService();
    this.paymentService = new PaymentService();

    this.getOrderDetail = this.getOrderDetail.bind(this);
    this.putOrder = this.putOrder.bind(this);
    this.getOrderOrderDetails = this.getOrderOrderDetails.bind(this);
    this.postEmailOrders = this.postEmailOrders.bind(this)
    this.putEmailOrderPending = this.putEmailOrderPending.bind(this)
  }

  async putEmailOrderPending(req: Request, res: Response, next: NextFunction) {
    try {
      const {orderId}  = req.params

      await this.orderService.composeTicketPendingOrder(orderId)

      return res
        .status(200)
        .json(createResponse(constants.SUCCESS_RESPONSE_MESSAGE, "successfully compose email for pending order"));
    } catch (error) {
      return next(error)
    }
  }

  async postEmailOrders(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderId } = req.params;

      await this.orderService.sendEmailToOder(orderId);

      return res
        .status(200)
        .json(createResponse(constants.SUCCESS_RESPONSE_MESSAGE, "successfully resend email"));
    } catch (error) {
      return next(error);
    }
  }

  async getOrderOrderDetails(req: Request, res: Response, next: NextFunction) {
    const { orderId } = req.params;

    try {
      const orderDetail =
        await this.orderDetailService.getOrderDetailDetailByOrderId(orderId);

      return res.json(
        createResponse(constants.SUCCESS_RESPONSE_MESSAGE, orderDetail)
      );
    } catch (error) {
      return next(error);
    }
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
