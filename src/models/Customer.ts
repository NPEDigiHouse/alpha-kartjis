import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { IPutTicketPurchasementPayload } from "../utils/interface/misc/ticketEvent";
import { BadRequestError } from "../exceptions/BadRequestError";
import { InternalServerError } from "../exceptions/InternalError";
import db from "../database";

export class Customer {
  async registerCustomer(id: string, payload: IPutTicketPurchasementPayload) {
    try {
      return await db.customer.create({
        data: {
          email: payload.customerProfile.email,
          gender: payload.customerProfile.gender,
          birthDate: payload.customerProfile.birthDate,
          name: payload.customerProfile.name,
          phoneNumber: payload.customerProfile.phoneNumber,
          id,
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
