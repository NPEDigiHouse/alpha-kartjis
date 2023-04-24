import { BadRequestError } from "../../exceptions/BadRequestError";
import { Order } from "../../models/Order";
import { v4 as uuidv4 } from "uuid";
import { hashData } from "../../utils";
import { TicketVerification } from "../../models/TicketVerification";

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

export class CallbackService {
  orderModel: Order;
  ticketVerificationModel: TicketVerification;

  constructor() {
    this.orderModel = new Order();
    this.ticketVerificationModel = new TicketVerification();
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

      const order = await this.orderModel.changePaymentStatusByBillId(
        data.bill_link_id,
        true
      );

      if (order) {
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
  }
}
