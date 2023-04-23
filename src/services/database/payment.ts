import { NotFoundError } from "../../exceptions/NotFoundError";
import { Order } from "../../models/Order";
import { v4 as uuidv4 } from "uuid";
import { hashData } from "../../utils";
import { TicketVerification } from "../../models/TicketVerification";
import { PaymentHelper } from "../../helper/PaymentHelper";

interface OrderDetail {
  orderDetailId: string;
  name: string;
  birthDate: number;
  phoneNumber: string;
  invoice: string;
  ticketId: string;
  orderDate: Date;
  gender: string;
  timestamp: number;
}

export class PaymentService {
  orderModel: Order;
  ticketVerificationModel: TicketVerification;

  constructor() {
    this.orderModel = new Order();
    this.ticketVerificationModel = new TicketVerification();
  }

  async payOrder(orderId: string) {
    const paymentHelper = new PaymentHelper();
    const billResponse = await paymentHelper.createBill();

    const order = await this.orderModel.updateBillIdAndPaymentId(
      orderId,
      billResponse.link_id
    );

    if (!order) {
      throw new NotFoundError("order's not found");
    }

    return { billLink: billResponse.link_url };
  }

  // !deprecated: temp use
  async payOrderDeprecated(orderId: string) {
    const order = await this.orderModel.changePaymentStatusById(orderId);

    if (!order) {
      throw new NotFoundError("order's not found");
    }

    for (let i = 0; i < order.orderDetails.length; i++) {
      const id = uuidv4();
      const orderDetail = order.orderDetails[i];
      const data = {
        orderDetailId: orderDetail.id,
        timestamp: Date.now(),
        birthDate: orderDetail.birthDate,
        gender: orderDetail.gender,
        invoice: orderDetail.orderId,
        phoneNumber: orderDetail.phoneNumber,
        name: orderDetail.name,
        ticketId: orderDetail.ticketId,
        orderDate: order.createdAt,
      } as OrderDetail;
      const hash = hashData(JSON.stringify(data));
      console.log(data);

      console.log(hash);

      await this.ticketVerificationModel.addNewVerification(
        id,
        hash,
        orderDetail.id
      );
    }
  }
}
