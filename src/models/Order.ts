import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { BadRequestError } from "../exceptions/BadRequestError";
import { InternalServerError } from "../exceptions/InternalError";
import db from "../database";

export class Order {
  async getOrderByStatus(status: "INPROCESS" | "SUCCESS" | "FAILED") {
    return await db.order.findMany({
      where: {
        status,
      },
    });
  }

  async changePaymentStatusByBillId(billId: number, status: boolean) {
    try {
      return await db.order.update({
        where: { billId },
        data: { status: status ? "SUCCESS" : "FAILED" },
        include: { orderDetails: { include: { Ticket: true } } },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new BadRequestError(error.message);
      } else if (error instanceof Error) {
        throw new InternalServerError(error.message);
      }
    }
  }

  async updateBillIdAndPaymentId(
    orderId: string,
    link_id: string,
    token: string
  ) {
    try {
      return await db.order.update({
        where: { id: orderId },
        data: { billLink: link_id, billToken: token },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new BadRequestError(error.message);
      } else if (error instanceof Error) {
        throw new InternalServerError(error.message);
      }
    }
  }

  async changePaymentStatusById(
    orderId: string,
    status: boolean,
    paymentType?: string
  ) {
    try {
      return await db.order.update({
        where: { id: orderId },
        data: { status: status ? "SUCCESS" : "FAILED", paymentType },
        include: {
          orderDetails: { include: { Ticket: true } },
          Event: true,
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
        orderDetails: { include: { Ticket: true } },
        Customer: true,
      },
    });
  }
}
