import { Router } from "express";
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
    this.router.route(this.path + "/tickets").post(this.handler.postTickets);
    this.router
      .route(this.path + "/tickets/:ticketId")
      .put(this.handler.putTicket);
    // * /events/:{eventId
    this.router
      .route(this.path + "/:eventId")
      .get(this.handler.getEvent)
      .put(this.handler.putEvent)
      .delete(this.handler.deleteEvent)
    // * /events/:{eventId}/tickets
    this.router
      .route(this.path + "/:eventId/tickets")
      .get(this.handler.getTickets)
      .put(this.handler.putTickets);
    // * /events/:{eventId}/tickets/{ticketId}
    this.router
      .route(this.path + "/:eventId/tickets/:ticketId")
      .get(this.handler.getTicket)
      .delete(this.handler.deleteTicket)

    return this.router;
  }
}
