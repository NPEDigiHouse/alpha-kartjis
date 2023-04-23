import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { BadRequestError } from "../exceptions/BadRequestError";
import { InternalServerError } from "../exceptions/InternalError";
import db from "../database";

export class Order {
  async changePaymentStatusById(orderId: string) {
    try {
      return await db.order.update({
        where: { id: orderId },
        data: { status: "SUCCESS" },
        include: {
          orderDetails: true,
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

  async getOrderById(orderId: string) {
    return await db.order.findUnique({
      where: { id: orderId },
      include: {
        Event: true,
        orderDetails: true,
        Customer: true,
      },
    });
  }
}
