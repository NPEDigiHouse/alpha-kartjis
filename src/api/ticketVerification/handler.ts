import { Request, Response, NextFunction } from "express";
import { TicketVerificationService } from "../../services/database/ticketVerification";
import { constants, createResponse } from "../../utils";

export class TicketVerificationHandler {
  ticketVerificationService: TicketVerificationService;
  constructor() {
    this.ticketVerificationService = new TicketVerificationService();

    this.putTicketVerification = this.putTicketVerification.bind(this);
  }

  async putTicketVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const { hash } = req.params;

      await this.ticketVerificationService.verifyTicketHash(hash);

      return res.json(
        createResponse(
          constants.SUCCESS_RESPONSE_MESSAGE,
          constants.SUCCESS_RESPONSE_MESSAGE
        )
      );
    } catch (error) {
      return next(error);
    }
  }
}
