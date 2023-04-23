import { BadRequestError } from "../../exceptions/BadRequestError";
import { Order } from "../../models/Order";

export class CallbackService {
  orderModel: Order;

  constructor() {
    this.orderModel = new Order();
  }

  async verifyPayment(data: any, token: any) {
    if (token !== process.env.FLIP_TOKEN) {
      throw new BadRequestError("token are not the same, payment failed");
    }
    data = JSON.parse(data);

    if (data.status === "FAILED") {
      await this.orderModel.changePaymentStatusByBillId(
        data.bill_link_id,
        false
      );
    }

    if (data.status === "SUCCESSFUL") {
      console.log("berhasil");

      await this.orderModel.changePaymentStatusByBillId(
        data.bill_link_id,
        true
      );
    }
  }
}
