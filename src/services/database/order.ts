import { NotFoundError } from "../../exceptions/NotFoundError";
import { Order } from "../../models/Order";
import { OrderDetailMapper } from "../../utils/dto/order";

export class OrderService {
  model: Order;

  constructor() {
    this.model = new Order();
  }

  async getOrderDetail(orderId: string) {
    const order = await this.model.getOrderById(orderId);

    if (!order) {
      throw new NotFoundError("order's not found");
    }

    return OrderDetailMapper(order);
  }
}
