import { config } from "../../config";
import { BadRequestError } from "../../exceptions/BadRequestError";
import { Order } from "../../models/Order";
import { TicketVerification } from "../../models/TicketVerification";
import { hashData } from "../../utils";
import { TicketConstruction } from "../facade/ticketConstruction";
import { Ticket } from "../../models/Ticket";
import amqlib from "amqplib";
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
        const order = await this.orderModel.changePaymentStatusById(
          data.order_id,
          false
        );

        if (order) {
          // await this.ticketConstruction.composeTicket(order, data.payment_type);

          for (let i = 0; i < order.orderDetails.length; i++) {
            this.ticketModel.reduceTicketBasedOnQuantityBought(
              order.orderDetails[i].ticketId,
              1,
              "INC"
            );
          }
        }
        // throw new BadRequestError("payment contains fraud content");
      }
    }

    const challengedSignatureKey = hashData(
      data.order_id +
        data.status_code +
        data.gross_amount +
        config.config().MIDTRANS_SERVER_KEY,
      "sha512"
    );

   console.log("challengedSignatureKey" + challengedSignatureKey);
   console.log("signatureKey" + data.signature_key);

    if (challengedSignatureKey !== data.signature_key) {
      const order = await this.orderModel.changePaymentStatusById(
        data.order_id,
        false
      );

      if (order) {
        // await this.ticketConstruction.composeTicket(order, data.payment_type);

        for (let i = 0; i < order.orderDetails.length; i++) {
          this.ticketModel.reduceTicketBasedOnQuantityBought(
            order.orderDetails[i].ticketId,
            1,
            "INC"
          );
        }
      }
      // throw new BadRequestError("transaction is not authentic");
    }

    if (
      data.transaction_status === "capture" ||
      data.transaction_status === "settlement"
    ) {
      const order = await this.orderModel.changePaymentStatusById(
        data.order_id,
        true,
        data.payment_type
      );

      if (order) {
        this.ticketConstruction.composeTicket(order, data.payment_type);

        //   for (let i = 0; i < order.orderDetails.length; i++) {
        //     await this.ticketModel.reduceTicketBasedOnQuantityBought(
        //       order.orderDetails[i].ticketId,
        //       1
        //     );
        //   }
      }
    } else if (
      data.transaction_status === "deny" ||
      data.transaction_status === "cancel" ||
      data.transaction_status === "expire" ||
      data.transaction_status === "refund" ||
      data.transaction_status === "partial_refund"
    ) {
      const order = await this.orderModel.changePaymentStatusById(
        data.order_id,
        false
      );

      if (order) {
        // await this.ticketConstruction.composeTicket(order, data.payment_type);

        for (let i = 0; i < order.orderDetails.length; i++) {
          this.ticketModel.reduceTicketBasedOnQuantityBought(
            order.orderDetails[i].ticketId,
            1,
            "INC"
          );
        }
      }
    }
  }

  private static async publishMessageOrderTopic(
    key: string,
    message: { orderId: string; isSuccess: boolean; paymentType?: string }
  ) {
    try {
      const connection = await amqlib.connect("amqp://localhost");
      const channel = await connection.createChannel();
      const orderTopic = "order_payment";

      channel.assertExchange(orderTopic, "topic", {
        durable: true,
      });

      console.log(message);

      channel.publish(orderTopic, key, Buffer.from(JSON.stringify(message)));
    } catch (error) {
      console.error(error);
    }
  }

  // * this will publish to mb
  async verifyPaymentCallback(data: any) {
    if (data.fraud_status) {
      if (data.fraud_status !== "accept") {
        // todo: message broker to publish failed payment
        await CallbackService.publishMessageOrderTopic(data.custom_field1, {
          orderId: data.order_id,
          isSuccess: false,
        });
        throw new BadRequestError("payment contains fraud content");
      }
    }

    const challengedSignatureKey = hashData(
      data.order_id +
        data.status_code +
        data.gross_amount +
        process.env.MIDTRANS_SERVER_KEY_PRODUCTION,
      "sha512"
    );

    if (data.signature_key && challengedSignatureKey !== data.signature_key) {
      console.log(data);

      // todo: message broker to publish failed payment
      await CallbackService.publishMessageOrderTopic(data.custom_field1, {
        orderId: data.order_id,
        isSuccess: false,
      });
      throw new BadRequestError("transaction is not authentic");
    }

    if (
      data.transaction_status === "capture" ||
      data.transaction_status === "settlement"
    ) {
      // todo: message broker to publish success payment
      await CallbackService.publishMessageOrderTopic(data.custom_field1, {
        orderId: data.order_id,
        isSuccess: true,
        paymentType: data.payment_type,
      });
    } else if (
      data.transaction_status === "deny" ||
      data.transaction_status === "cancel" ||
      data.transaction_status === "expire" ||
      data.transaction_status === "refund" ||
      data.transaction_status === "partial_refund"
    ) {
      // todo: message broker to publish failed payment
      await CallbackService.publishMessageOrderTopic(data.custom_field1, {
        orderId: data.order_id,
        isSuccess: false,
      });
    }
  }
}
