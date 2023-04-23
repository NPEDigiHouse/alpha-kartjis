import { Router } from "express";
import { TicketVerificationHandler } from "./handler";

export class TicketVerificationRouter {
  handler: TicketVerificationHandler;
  path: string;
  router: Router;

  constructor() {
    this.path = "/ticket-verifications";
    this.router = Router();
    this.handler = new TicketVerificationHandler();
  }

  register() {
    // * /ticket-verifications
    // * PUT method verifies ticket
    this.router
      .route(this.path + "/:hash")
      .put(this.handler.putTicketVerification);

    return this.router;
  }
}
