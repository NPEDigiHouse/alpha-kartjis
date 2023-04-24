import { NotFoundError } from "../../exceptions/NotFoundError";
import { Order } from "../../models/Order";
import { TicketVerification } from "../../models/TicketVerification";
import { PaymentHelper } from "../../helper/PaymentHelper";
import { TicketConstruction } from "./ticketConstruction";

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

  constructor() {
    this.orderModel = new Order();
    this.ticketVerificationModel = new TicketVerification();
    this.paymentHelper = new PaymentHelper();
  }

  async payOrder(orderId: string) {
    const billResponse = await this.paymentHelper.createBill();

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

    //! this object is only for testing so I make it local object
    const ticketConstruction = new TicketConstruction();
    await ticketConstruction.composeTicket(order);

    return { billLink: "https://random.site" };
  }
}
