import { Request, Response, NextFunction } from 'express';
import { OrderDetailService } from '../../services/database/orderDetail';
import { constants, createResponse } from '../../utils';

export class OrderDetailHandler {
  orderDetailService: OrderDetailService;

  constructor() {
    this.orderDetailService = new OrderDetailService();

    this.getOrderDetailDetail = this.getOrderDetailDetail.bind(this);
    this.getOrderDetails = this.getOrderDetails.bind(this);
    this.getOfflineTicket = this.getOfflineTicket.bind(this);
  }

  async getOrderDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { eventId } = req.params;
      const { page,sort } = req.query;

      const orderDetails = await this.orderDetailService.getOrderDetails(
        eventId,
        // parseInt(String(page ?? '1')),
        page ? Number(page) : undefined,
        String(sort)
      );

      return res.json(
        createResponse(constants.SUCCESS_RESPONSE_MESSAGE, orderDetails),
      );
    } catch (error) {
      return next(error);
    }
  }

  async getOfflineTicket(req: Request, res: Response, next: NextFunction) {
    const { eventId } = req.params;
    const { location } = req.query;

    const orderDetails = await this.orderDetailService.getOfflineTickets(
      eventId,
      String(location),
    );

    return res.json(
      createResponse(constants.SUCCESS_RESPONSE_MESSAGE, orderDetails),
    );
  }

  async getOrderDetailDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const { orderDetailId } = req.params;

      const orderDetail = await this.orderDetailService.getOrderDetailDetail(
        orderDetailId,
      );

      return res.json(
        createResponse(constants.SUCCESS_RESPONSE_MESSAGE, orderDetail),
      );
    } catch (error) {
      return next(error);
    }
  }
}
