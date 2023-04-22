import { Router } from "express";
import { BaseRouter } from "../../routers/BaseRouter";
import { EventHandler } from "./handler";

export class EventRouter {
  handler: EventHandler;
  path: string;
  router: Router;

  constructor() {
    this.path = "/events";
    this.router = Router();
    this.handler = new EventHandler();
  }

  register() {
    // * /events
    this.router
      .route(this.path)
      .get(this.handler.getEvents)
      .post(this.handler.postEvents);
    // * /events/:{eventId}
    this.router.route(this.path + "/:eventId").get(this.handler.getEvent);
    // * /events/:{eventId}/tickets
    this.router
      .route(this.path + "/:eventId/tickets")
      .get(this.handler.getTickets)
      .post(this.handler.postTickets)
      .put(this.handler.putTickets);
    // * /events/:{eventId}/tickets/{ticketId}
    this.router
      .route(this.path + "/:eventId/tickets")
      .get(this.handler.getTicket);

    return this.router;
  }
}
