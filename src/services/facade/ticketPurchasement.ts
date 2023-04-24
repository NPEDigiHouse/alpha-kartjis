import { BadRequestError } from "../../exceptions/BadRequestError";
import { Customer } from "../../models/Customer";
import { Order } from "../../models/Order";
import { OrderDetail } from "../../models/OrderDetail";
import { Ticket } from "../../models/Ticket";
import { IPutTicketPurchasementPayload } from "../../utils/interface/misc/ticketEvent";
import { v4 as uuidv4 } from "uuid";

export class TicketPurchasemmentService {
  ticketModel: Ticket;
  customerModel: Customer;
  orderModel: Order;
  orderDetailModel: OrderDetail;

  constructor() {
    this.ticketModel = new Ticket();
    this.customerModel = new Customer();
    this.orderModel = new Order();
    this.orderDetailModel = new OrderDetail();
  }

  async orderTicketOfAnEvent(
    eventId: string,
    payload: IPutTicketPurchasementPayload
  ) {
    const tickets = await this.ticketModel.getTicketByEventId(eventId);

    for (let i = 0; i < tickets.length; i++) {
      const ticket = payload.tickets.find(
        (ticket) => ticket.ticketId === tickets[i].id
      );

      if (ticket) {
        if (tickets[i].stock < ticket.quantity) {
          throw new BadRequestError(tickets[i].name + " ticket's sold out");
        }
      }
    }

    const customerId = uuidv4();

    const customer = await this.customerModel.registerCustomer(
      customerId,
      payload
    );

    const orderId = uuidv4();
    const order = await this.orderModel.addNewOrder(
      eventId,
      orderId,
      customer?.id
    );

    // * as much as possible trying to use bulking insert native to ORM
    // * this will create uuids based on the number of tickets purchased (duplicate ticket is count)
    const ids = [];
    for (let i = 0; i < payload.tickets.length; i++) {
      ids.push(uuidv4());
    }

    await this.orderDetailModel.addNewOrderDetail(ids, orderId, payload);

    for (let i = 0; i < payload.tickets.length; i++) {
      await this.ticketModel.reduceTicketBasedOnQuantityBought(
        payload.tickets[i].ticketId,
        1
      );
    }

    return order;
  }
}
