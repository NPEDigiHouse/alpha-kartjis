import { NextFunction, Request, Response } from "express";
import { EventService } from "../../services/database/event";
import { constants, createResponse } from "../../utils";
import { EventPayloadValidator } from "../../validator/events";
import { IPostEventPayload } from "../../utils/interface/event";
import { IPostTicketPayload } from "../../utils/interface/ticket";
import { TicketPayloadValidator } from "../../validator/tickets";
import { TicketService } from "../../services/database/ticket";
import { IPutTicketPurchasementPayload } from "../../utils/interface/misc/ticketEvent";
import { TicketPurchasementValidator } from "../../validator/misc/ticketEvent";
import { TicketPurchasemmentService } from "../../services/database/ticketPurchasement";

export class EventHandler {
  private eventService: EventService;
  private ticketService: TicketService;
  private ticketPurchasementService: TicketPurchasemmentService;
  private eventValidator: EventPayloadValidator;
  private ticketValidator: TicketPayloadValidator;
  private ticketPurchasementValidator: TicketPurchasementValidator;

  constructor() {
    this.eventService = new EventService();
    this.ticketService = new TicketService();
    this.ticketPurchasementService = new TicketPurchasemmentService();
    this.eventValidator = new EventPayloadValidator();
    this.ticketValidator = new TicketPayloadValidator();
    this.ticketPurchasementValidator = new TicketPurchasementValidator();

    this.getEvents = this.getEvents.bind(this);
    this.getEvent = this.getEvent.bind(this);
    this.postEvents = this.postEvents.bind(this);
    this.postTickets = this.postTickets.bind(this);
    this.putTickets = this.putTickets.bind(this);
  }

  async getEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const events = await this.eventService.getAllEvents();

      return res.json(
        createResponse(constants.SUCCESS_RESPONSE_MESSAGE, events)
      );
    } catch (error) {
      return next(error);
    }
  }

  async getEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const { eventId } = req.params;

      const event = await this.eventService.getEventById(eventId);

      return res.json(
        createResponse(constants.SUCCESS_RESPONSE_MESSAGE, event)
      );
    } catch (error) {
      return next(error);
    }
  }

  async postEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body as IPostEventPayload;
      this.eventValidator.validatePostPayload(payload);

      const event = await this.eventService.addNewEvent(payload);

      return res
        .status(201)
        .json(createResponse(constants.SUCCESS_RESPONSE_MESSAGE, event));
    } catch (error) {
      return next(error);
    }
  }

  async getTickets(req: Request, res: Response, next: NextFunction) {}

  async postTickets(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body as IPostTicketPayload;
      this.ticketValidator.validatePostPayload(payload);
      const { eventId } = req.params;

      const ticket = await this.ticketService.addNewTicketsForEvent(
        eventId,
        payload
      );

      return res
        .status(201)
        .json(createResponse(constants.SUCCESS_RESPONSE_MESSAGE, ticket));
    } catch (error) {
      return next(error);
    }
  }

  async getTicket(req: Request, res: Response, next: NextFunction) {}

  async putTickets(req: Request, res: Response, next: NextFunction) {
    try {
      const payload = req.body as IPutTicketPurchasementPayload;
      this.ticketPurchasementValidator.validatePutPayload(payload);
      const { eventId } = req.params;

      const order = await this.ticketPurchasementService.orderTicketOfAnEvent(
        eventId,
        payload
      );

      return res
        .status(200)
        .json(createResponse(constants.SUCCESS_RESPONSE_MESSAGE, order));
    } catch (error) {
      return next(error);
    }
  }
}
