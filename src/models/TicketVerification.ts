import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { BadRequestError } from "../exceptions/BadRequestError";
import { InternalServerError } from "../exceptions/InternalError";
import db from "../database";

export class TicketVerification {
  async scanTicketVerification(id: string) {
    try {
      return await db.ticketVerification.update({
        where: { id },
        data: { isScanned: true },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new BadRequestError(error.message);
      } else if (error instanceof Error) {
        throw new InternalServerError(error.message);
      }
    }
  }

  async getTicketVerificationByHash(hash: string) {
    return await db.ticketVerification.findUnique({ where: { hash } });
  }

  async addNewVerification(id: string, hash: string, orderDetailId: string) {
    try {
      return await db.ticketVerification.create({
        data: {
          hash,
          id,
          orderDetailId,
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
