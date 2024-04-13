import { Router } from "express";
import { StatsHandler } from "./handler";

export class StatsRouter {
  handler: StatsHandler;
  path: string;
  router: Router;

  constructor() {
    this.path = "/stats";
    this.router = Router();
    this.handler = new StatsHandler();
  }

  register() {
    this.router
      .route(this.path + "/events/:eventId")
      .get(this.handler.getEventStats);
      
    // * /events
    this.router
      .route(this.path + "/events/:eventId/tickets")
      .get(this.handler.getEventTicketStats);

    return this.router;
  }
}
