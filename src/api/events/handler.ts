import { NextFunction, Request, Response } from 'express';
import { EventService } from '../../services/database/event';
import { constants, createResponse } from '../../utils';
import { EventPayloadValidator } from '../../validator/events';
import {
    IPostEventPayload,
    IPutEventPayload,
} from '../../utils/interface/event';
import {
    IPostTicketPayload,
    IPutTicketPayload,
} from '../../utils/interface/ticket';
import { TicketPayloadValidator } from '../../validator/tickets';
import { TicketService } from '../../services/database/ticket';
import { IPutTicketPurchasementPayload } from '../../utils/interface/misc/ticketEvent';
import { TicketPurchasementValidator } from '../../validator/misc/ticketEvent';
import { TicketPurchasemmentService } from '../../services/facade/ticketPurchasement';

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
        this.putEvent = this.putEvent.bind(this);
        this.putTicket = this.putTicket.bind(this);
        this.deleteEvent = this.deleteEvent.bind(this);
        this.deleteTicket = this.deleteTicket.bind(this)
    }

    async putTicket(req: Request, res: Response, next: NextFunction) {
        const { ticketId } = req.params;

        try {
            const payload = req.body as IPutTicketPayload;
            this.ticketValidator.validatePutPayload(payload);

            const ticket = await this.ticketService.updateTicket(
                ticketId,
                payload
            );

            return res
                .status(200)
                .json(
                    createResponse(constants.SUCCESS_RESPONSE_MESSAGE, ticket)
                );
        } catch (error) {
            return next(error);
        }
    }

    async putEvent(req: Request, res: Response, next: NextFunction) {
        const { eventId } = req.params;

        try {
            const payload = req.body as IPutEventPayload;
            this.eventValidator.validatePutPayload(payload);

            const event = await this.eventService.updateEventById(
                eventId,
                payload
            );

            return res
                .status(200)
                .json(
                    createResponse(constants.SUCCESS_RESPONSE_MESSAGE, event)
                );
        } catch (error) {
            return next(error);
        }
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

    async deleteEvent(req: Request, res: Response, next: NextFunction) {
        try {
            const { eventId } = req.params;

            const deletedEvent = await this.eventService.deleteEventById(
                eventId
            );

            return res
                .status(200)
                .json({ message: 'Record deleted successfully', deletedEvent });
        } catch (error) {
            return next(error);
        }
    }

    async deleteTicket(req: Request, res: Response, next: NextFunction) {
        try {
            const { eventId, ticketId } = req.params;

            const deletedTicket = await this.ticketService.deleteTicketById(
                ticketId
            );

            return res
                .status(200)
                .json({
                    message: 'Record deleted successfully',
                    deletedTicket,
                });
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
                .json(
                    createResponse(constants.SUCCESS_RESPONSE_MESSAGE, event)
                );
        } catch (error) {
            return next(error);
        }
    }

    async getTickets(req: Request, res: Response, next: NextFunction) {}

    async postTickets(req: Request, res: Response, next: NextFunction) {
        try {
            const payload = req.body as IPostTicketPayload;
            this.ticketValidator.validatePostPayload(payload);

            const ticket = await this.ticketService.addNewTicketsForEvent(
                payload
            );

            return res
                .status(201)
                .json(
                    createResponse(constants.SUCCESS_RESPONSE_MESSAGE, ticket)
                );
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

            const order =
                await this.ticketPurchasementService.orderTicketOfAnEvent(
                    eventId,
                    payload
                );

            return res
                .status(200)
                .json(
                    createResponse(constants.SUCCESS_RESPONSE_MESSAGE, order)
                );
        } catch (error) {
            return next(error);
        }
    }
}
