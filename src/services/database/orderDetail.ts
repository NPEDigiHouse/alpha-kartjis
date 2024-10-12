import { BadRequestError } from '../../exceptions/BadRequestError';
import { NotFoundError } from '../../exceptions/NotFoundError';
import { OrderDetail } from '../../models/OrderDetail';
import { OrderDetailDetailMapper } from '../../utils/dto/orderDetail';

export class OrderDetailService {
  private model: OrderDetail;

  constructor() {
    this.model = new OrderDetail();
  }

  async getOrderDetailDetailByOrderId(orderId: string) {
    const orderDetail = await this.model.getOrderDetailByorderId(orderId);

    if (!orderDetail) {
      throw new NotFoundError("orderDetail's not found");
    }

    if (orderDetail[0]?.Order?.status !== 'SUCCESS') {
      throw new BadRequestError(
        "order hasn't been verified, the status is " +
          orderDetail[0]?.Order?.status,
      );
    }

    return orderDetail.map((d) => {
      return OrderDetailDetailMapper(d);
    });
  }

  async getOrderDetails(eventId: string, page?: number, sort?: string) {
    return this.model.getOrderDetails(eventId, page, sort);
  }

  async getOfflineTickets(eventId: string, location: string) {
    return this.model.getOfflineTicketData(eventId, location);
  }

  async getOrderDetailDetail(orderDetailId: string) {
    const orderDetail = await this.model.getOrderDetailById(orderDetailId);

    if (!orderDetail) {
      throw new NotFoundError("orderDetail's not found");
    }

    if (orderDetail.Order?.status !== 'SUCCESS') {
      throw new BadRequestError(
        "order hasn't been verified, the status is " +
          orderDetail.Order?.status,
      );
    }

    return OrderDetailDetailMapper(orderDetail);
  }
}
