import { BadRequestError } from "../../exceptions/BadRequestError";
import { Order } from "../../models/Order";
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

  async verifyPayment(data: any) {
    if (data.fraud_status) {
      if (data.fraud_status !== "accept") {
        throw new BadRequestError("payment contains fraud content");
      }
    }

    if (
      data.transaction_status === "capture" ||
      data.transaction_status === "settlement"
    ) {
      const order = await this.orderModel.changePaymentStatusById(
        data.order_id,
        true
      );

      if (order) {
        await this.ticketConstruction.composeTicket(order);
      }
    } else if (
      data.transaction_status === "deny" ||
      data.transaction_status === "cancel" ||
      data.transaction_status === "expire"
    )
      await this.orderModel.changePaymentStatusById(data.order_id, false);
  }
}
