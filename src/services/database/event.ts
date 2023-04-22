import { v4 as uuidv4 } from "uuid";
import { NotFoundError } from "../..//exceptions/NotFoundError";
import { Event } from "../../models/Event";
import { IPostEventPayload } from "../../utils/interface/event";
import { EventDetailMapper, ListEventMapper } from "../../utils/dto/event";

export class EventService {
  model: Event;

  constructor() {
    this.model = new Event();
  }

  async getAllEvents() {
    const data = (await this.model.getAllEvents()).map(ListEventMapper);

    return data;
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
