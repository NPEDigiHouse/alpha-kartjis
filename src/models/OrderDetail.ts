import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { BadRequestError } from "../exceptions/BadRequestError";
import { InternalServerError } from "../exceptions/InternalError";
import { IPutTicketPurchasementPayload } from "../utils/interface/misc/ticketEvent";
import db from "../database";

export class OrderDetail {
  async getOrderDetailByorderId(orderId: string) {
    return await db.orderDetail.findMany({
      where: { orderId },
      include: {
        Order: {
          include: {
            Event: true,
            orderDetails: {
              include: { Ticket: true },
            },
          },
        },
        TicketVerification: true,
        Ticket: true,
      },
      orderBy: {
        id: "asc",
      },
    });
  }

  async getOrderDetails(eventId: string, page: number = 1) {
    return db.orderDetail.findMany({
      where: {
        Order: {
          eventId,
          status: "SUCCESS",
        },
      },
      select: {
        location: true,
        birthDate: true,
        email: true,
        gender: true,
        name: true,
        phoneNumber: true,
        address: true,
        socialMedia: true,
        Order: {
          select: {
            id: true,
            createdAt: true,
            updatedAt: true,
            paymentType: true,
          },
        },
        Ticket: {
          select: {
            name: true,
          },
        },
      },
      take: 20,
      skip: (page - 1) * 20,
    });
  }

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
          address: payload.tickets[i].address,
          socialMedia: payload.tickets[i].socialMedia,
          location: payload.tickets[i].location,
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
            orderDetails: {
              include: { Ticket: true },
              where: { id: orderDetailId },
            },
          },
        },
        TicketVerification: true,
        Ticket: true,
      },
    });
  }
}
