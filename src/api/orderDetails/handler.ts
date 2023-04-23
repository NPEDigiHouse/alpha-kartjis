import { Request, Response, NextFunction } from "express";
import { OrderDetailService } from "../../services/database/orderDetail";
import { constants, createResponse } from "../../utils";

export class OrderDetailHandler {
  orderDetailService: OrderDetailService;

  constructor() {
    this.orderDetailService = new OrderDetailService();

    this.getOrderDetailDetail = this.getOrderDetailDetail.bind(this);
  }

  async getOrderDetailDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderDetailId } = req.params;

      const orderDetail = await this.orderDetailService.getOrderDetailDetail(
        orderDetailId
      );

      return res.json(
        createResponse(constants.SUCCESS_RESPONSE_MESSAGE, orderDetail)
      );
    } catch (error) {
      return next(error);
    }
  }
}
