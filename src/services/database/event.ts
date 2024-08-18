import { v4 as uuidv4 } from "uuid";
import { NotFoundError } from "../..//exceptions/NotFoundError";
import { Event } from "../../models/Event";
import {
  IPostEventPayload,
  IPutEventPayload,
} from "../../utils/interface/event";
import { EventDetailMapper, ListEventMapper } from "../../utils/dto/event";

export class EventService {
  model: Event;

  constructor() {
    this.model = new Event();
  }

  async deleteEventById(eventId: string) {
    return await this.model.deleteEventById(eventId)
  }

  async updateEventById(eventId: string, payload: IPutEventPayload) {
    return await this.model.updateEventById(eventId, payload);
  }

  async getAllEvents() {
    const data = (await this.model.getAllEvents()).map(ListEventMapper);

    return data;
  }

  async getEventByIdV2(eventId: string) {
    const event = await this.model.getEventById(eventId);

    if (!event) {
      throw new NotFoundError("event's not found");
    }

    return event;
  }

  async getEventById(eventId: string) {
    const event = await this.model.getEventById(eventId);

    if (!event) {
      throw new NotFoundError("event's not found");
    }

    return EventDetailMapper(event);
  }

  async addNewEvent(payload: IPostEventPayload) {
    const eventId = uuidv4();
    return await this.model.addNewEvent(eventId, payload);
  }
}
