import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { IPostTicketPayload } from "../utils/interface/ticket";
import { BadRequestError } from "../exceptions/BadRequestError";
import { InternalServerError } from "../exceptions/InternalError";
import db from "../database";

export class Ticket {
  async reduceTicketBasedOnQuantityBought(
    ticketId: string | null,
    quantity: number
  ) {
    try {
      return await db.ticket.update({
        where: {
          id: ticketId || "",
        },
        data: {
          stock: { decrement: quantity },
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new BadRequestError(error.message);
      } else if (error instanceof Error) {
        throw new InternalServerError(error.message);
      }
    }
  }

  async addNewTicketByEventId(
    eventId: string,
    id: string,
    payload: IPostTicketPayload
  ) {
    try {
      return await db.ticket.create({
        data: {
          eventId,
          id,
          name: payload.name,
          price: payload.price,
          stock: payload.stock,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new BadRequestError(error.message);
      } else if (error instanceof Error) {
        throw new InternalServerError(error.message);
      }
    }
  }

  async getTicketByEventId(eventId: string) {
    return await db.ticket.findMany({
      where: { eventId },
    });
  }
}
