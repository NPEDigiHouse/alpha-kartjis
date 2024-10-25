import { NextFunction, Request, Response } from 'express';
import { EventService } from '../../services/database/event';
import { constants, createResponse } from '../../utils';
import { bool } from 'joi';

export class StatsHandler {
  private eventService: EventService;

  constructor() {
    this.eventService = new EventService();

    this.getEventTicketStats = this.getEventTicketStats.bind(this);
    this.getEventStats = this.getEventStats.bind(this);
  }

  async getEventStats(req: Request, res: Response, next: NextFunction) {
    const { eventId } = req.params;
    const { isOffline } = req.query;

    try {
      const event = await this.eventService.getEventByIdV2(
        eventId,
        Boolean(isOffline),
      );

      let net = 0;
      let sold = 0;

      event.tickets.forEach((t: any) => {
        net +=
          t.orders.filter(
            (o: any) => o.ticketId === t.id && o.Order?.status === 'SUCCESS',
          ).length * t.price;
        sold += t.orders.filter(
          (o: any) => o.ticketId === t.id && o.Order?.status === 'SUCCESS',
        ).length;
      });

      return res.json(
        createResponse(constants.SUCCESS_RESPONSE_MESSAGE, {
          totalEvent: 1,
          net,
          sold,
        }),
      );
    } catch (error) {
      return next(error);
    }
  }

  async getEventTicketStats(req: Request, res: Response, next: NextFunction) {
    const { eventId } = req.params;

    try {
      const event = await this.eventService.getEventByIdV2(eventId);

      // console.log(event.tickets);

      return res.json(
        createResponse(constants.SUCCESS_RESPONSE_MESSAGE, {
          eventName: event.name,
          tickets: event.tickets.map((t: any) => ({
            ticketName: t.name,
            price: t.price,
            sold: t.orders.filter(
              (o: any) => o.ticketId === t.id && o.Order?.status === 'SUCCESS',
            ).length,
            net:
              t.orders.filter(
                (o: any) =>
                  o.ticketId === t.id && o.Order?.status === 'SUCCESS',
              ).length * t.price,
            adminFee:
              t.orders.filter(
                (o: any) =>
                  o.ticketId === t.id && o.Order?.status === 'SUCCESS',
              ).length * (t.adminFee ?? 0),
          })),
        }),
      );
    } catch (error) {
      return next(error);
    }
  }
}
