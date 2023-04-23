import { BadRequestError } from "../../exceptions/BadRequestError";
import { NotFoundError } from "../../exceptions/NotFoundError";
import { OrderDetail } from "../../models/OrderDetail";
import { OrderDetailDetailMapper } from "../../utils/dto/orderDetail";

export class OrderDetailService {
  model: OrderDetail;

  constructor() {
    this.model = new OrderDetail();
  }

  async getOrderDetailDetail(orderDetailId: string) {
    const orderDetail = await this.model.getOrderDetailById(orderDetailId);

    if (!orderDetail) {
      throw new NotFoundError("orderDetail's not found");
    }

    if (orderDetail.Order?.status !== "SUCCESS") {
      throw new BadRequestError(
        "order hasn't been verified, the status is " + orderDetail.Order?.status
      );
    }

    return OrderDetailDetailMapper(orderDetail);
  }
}
