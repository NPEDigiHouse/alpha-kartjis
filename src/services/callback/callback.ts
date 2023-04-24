import { BadRequestError } from "../../exceptions/BadRequestError";
import { Order } from "../../models/Order";
import { v4 as uuidv4 } from "uuid";
import { hashData } from "../../utils";
import { TicketVerification } from "../../models/TicketVerification";
import { TicketConstruction } from "../facade/ticketConstruction";

export class CallbackService {
  orderModel: Order;
  ticketVerificationModel: TicketVerification;
  ticketConstruction: TicketConstruction;

  constructor() {
    this.orderModel = new Order();
    this.ticketVerificationModel = new TicketVerification();
    this.ticketConstruction = new TicketConstruction();
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
      const order = await this.orderModel.changePaymentStatusByBillId(
        data.bill_link_id,
        true
      );

      if (order) {
        await this.ticketConstruction.composeTicket(order);
      }
    }
  }
}
