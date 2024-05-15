import { Order } from "../models/Order";
import { TicketConstruction } from "../services/facade/ticketConstruction";

const sendTicket = async () => {
  const orderModel = new Order();
  const ticketConstruction = new TicketConstruction();

  const order = await orderModel.changePaymentStatusById(
    "2e6d2d1b-bba5-4420-bc34-5bb088549acb",
    true
  );

  if (order) {
    await ticketConstruction.composeTicket(order, "qris");

    //   for (let i = 0; i < order.orderDetails.length; i++) {
    //     await this.ticketModel.reduceTicketBasedOnQuantityBought(
    //       order.orderDetails[i].ticketId,
    //       1
    //     );
    //   }
  }
};

sendTicket();
