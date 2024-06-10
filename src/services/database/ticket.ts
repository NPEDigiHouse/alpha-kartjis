import { Ticket } from "../../models/Ticket";
import {
  IPostTicketPayload,
  IPutTicketPayload,
} from "../../utils/interface/ticket";
import { v4 as uuidv4 } from "uuid";

export class TicketService {
  model: Ticket;

  constructor() {
    this.model = new Ticket();
  }

  async updateTicket(ticketId: string, payload: IPutTicketPayload) {
    return await this.model.updateTicketById(ticketId, payload);
  }

  async addNewTicketsForEvent(payload: IPostTicketPayload) {
    const id = uuidv4();

    return await this.model.addNewTicketByEventId(id, payload);
  }
}
