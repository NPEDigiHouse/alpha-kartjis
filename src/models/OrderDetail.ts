import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { BadRequestError } from "../exceptions/BadRequestError";
import { InternalServerError } from "../exceptions/InternalError";
import { IPutTicketPurchasementPayload } from "../utils/interface/misc/ticketEvent";
import db from "../database";

export class OrderDetail {
  async addNewOrderDetail(
    ids: string[],
    orderId: string,
    payload: IPutTicketPurchasementPayload
  ) {
    try {
      const data = [];
      for (let i = 0; i < payload.tickets.length; i++) {
        const orderDetail = {
          id: ids[i],
          ticketId: payload.tickets[i].ticketId,
          email: payload.tickets[i].email,
          gender: payload.tickets[i].gender,
          name: payload.tickets[i].name,
          phoneNumber: payload.tickets[i].phoneNumber,
          quantity: payload.tickets[i].quantity,
          birthDate: payload.tickets[i].birthDate,
          orderId,
        };

        data.push(orderDetail);
      }

      return await db.orderDetail.createMany({
        data,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new BadRequestError(error.message);
      } else if (error instanceof Error) {
        throw new InternalServerError(error.message);
      }
    }
  }

  async getOrderDetailById(orderDetailId: string) {
    return await db.orderDetail.findUnique({
      where: { id: orderDetailId },
      include: {
        Order: {
          include: {
            Event: true,
            orderDetails: { include: { Ticket: true } },
          },
        },
        TicketVerification: true,
        Ticket: true,
      },
    });
  }
}
