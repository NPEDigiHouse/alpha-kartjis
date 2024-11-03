import { NotFoundError } from "../../exceptions/NotFoundError";
import { Order } from "../../models/Order";
import { TicketVerification } from "../../models/TicketVerification";
import { PaymentHelper } from "../../helper/PaymentHelper";
import { TicketConstruction } from "./ticketConstruction";
import { Ticket } from "../../models/Ticket";

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
  paymentHelper: PaymentHelper;
  ticketConstruction: TicketConstruction

  constructor(ticketConstruction: TicketConstruction) {
    this.orderModel = new Order();
    this.ticketVerificationModel = new TicketVerification();
    this.paymentHelper = new PaymentHelper();
    this.ticketConstruction = ticketConstruction;
  }

  async payOrder(orderId: string) {
    const order = await this.orderModel.getOrderById(orderId);
    let amount = 0;
    if (order) {
      for (let i = 0; i < order.orderDetails.length; i++) {
        const orderDetail = order.orderDetails[i];
        if (orderDetail.Ticket) {
          amount +=
            orderDetail.Ticket?.price + (orderDetail.Ticket.adminFee ?? 10000);
        }
      }
    }

    const billResponse = await this.paymentHelper.createBill(orderId, amount);

    if (billResponse && !order?.billLink && !order?.billToken) {
      const orderUpdated = await this.orderModel.updateBillIdAndPaymentId(
        orderId,
        billResponse.redirect_url,
        billResponse.token
      );

      if (!orderUpdated) {
        throw new NotFoundError("order's not found");
      }

      return {
        billLink: billResponse.redirect_url,
        token: billResponse.token,
      };
    }

    return { billLink: order?.billLink, token: order?.billToken };
  }

  // !deprecated: temp use
  async payOrderDeprecated(orderId: string) {
    const order = await this.orderModel.changePaymentStatusById(orderId, true);

    if (!order) {
      throw new NotFoundError("order's not found");
    }
    /*
    const ticketModel = new Ticket();
    if (order) {
      for (let i = 0; i < order.orderDetails.length; i++) {
        await ticketModel.reduceTicketBasedOnQuantityBought(
          order.orderDetails[i].ticketId,
          1,
          "DEC"
        );
      }
    }
    */

    //! this object is only for testing so I make it local object
    await this.ticketConstruction.composeTicket(orderId, "other");

    // return { billLink: "https://random.site", token: "asfjotuasdf0127491" };
    return { billLink: "", token: "" };
  }
}
