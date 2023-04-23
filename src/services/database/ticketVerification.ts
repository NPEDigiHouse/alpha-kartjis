import { BadRequestError } from "../../exceptions/BadRequestError";
import { NotFoundError } from "../../exceptions/NotFoundError";
import { TicketVerification } from "../../models/TicketVerification";

export class TicketVerificationService {
  model: TicketVerification;

  constructor() {
    this.model = new TicketVerification();
  }

  async verifyTicketHash(hash: string) {
    const ticketVerification = await this.model.getTicketVerificationByHash(
      hash
    );

    if (!ticketVerification) {
      throw new NotFoundError("ticket's not found");
    }

    if (ticketVerification.isScanned) {
      throw new BadRequestError("ticket has been scanned");
    }

    await this.model.scanTicketVerification(ticketVerification.id);
  }
}
