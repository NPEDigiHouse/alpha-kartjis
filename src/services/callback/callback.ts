import { config } from "../../config";
import { BadRequestError } from "../../exceptions/BadRequestError";
import { Order } from "../../models/Order";
import { TicketVerification } from "../../models/TicketVerification";
import { hashData } from "../../utils";
import { TicketConstruction } from "../facade/ticketConstruction";
import { Ticket } from "../../models/Ticket";
import dotenv from "dotenv";

dotenv.config();

export class CallbackService {
  orderModel: Order;
  ticketVerificationModel: TicketVerification;
  ticketModel: Ticket;
  ticketConstruction: TicketConstruction;

  constructor() {
    this.orderModel = new Order();
    this.ticketVerificationModel = new TicketVerification();
    this.ticketConstruction = new TicketConstruction();
    this.ticketModel = new Ticket();
  }

  async verifyPayment(data: any) {
    if (data.fraud_status) {
      if (data.fraud_status !== "accept") {
        throw new BadRequestError("payment contains fraud content");
      }
    }

    const challengedSignatureKey = hashData(
      data.order_id +
        data.status_code +
        data.gross_amount +
        config.config().MIDTRANS_SERVER_KEY,
      "sha512"
    );

    if (challengedSignatureKey !== data.signature_key) {
      throw new BadRequestError("transaction is not authentic");
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
        await this.ticketConstruction.composeTicket(order, data.payment_type);

        for (let i = 0; i < order.orderDetails.length; i++) {
          await this.ticketModel.reduceTicketBasedOnQuantityBought(
            order.orderDetails[i].ticketId,
            1
          );
        }
      }
    } else if (
      data.transaction_status === "deny" ||
      data.transaction_status === "cancel" ||
      data.transaction_status === "expire"
    )
      await this.orderModel.changePaymentStatusById(data.order_id, false);
  }
}
