import { Ticket } from "../../models/Ticket";
import { IPostTicketPayload } from "../../utils/interface/ticket";
import { v4 as uuidv4 } from "uuid";

export class TicketService {
  model: Ticket;

  constructor() {
    this.model = new Ticket();
  }

  async addNewTicketsForEvent(eventId: string, payload: IPostTicketPayload) {
    const id = uuidv4();

    return await this.model.addNewTicketByEventId(eventId, id, payload);
  }
}
