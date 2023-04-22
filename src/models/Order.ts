import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { BadRequestError } from "../exceptions/BadRequestError";
import { InternalServerError } from "../exceptions/InternalError";
import db from "../database";

export class Order {
  async addNewOrder(eventId: string, orderId: string, customerId?: string) {
    try {
      return await db.order.create({
        data: {
          id: orderId,
          customerId,
          eventId,
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
}
