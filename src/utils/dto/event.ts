import { Event, Prisma, Ticket } from "@prisma/client";
import { IEvent, IEventSchedule } from "../interface/event";

interface IListEventsDTO {
  id: string;
  name: string;
  location: string;
  thumbnailURI?: string;
  schedules: IEventSchedule[];
  cheapestTicketPrice?: number;
  expensiveTicketPrice?: number;
}

interface IEventDetailDTO {
  id: string;
  name: string;
  location: string;
  thumbnailURI?: string;
  schedules: IEventSchedule[];
  description?: string;
  tickets?: Ticket[];
}

export const ListEventMapper = (
  data: Event & {
    tickets: Ticket[];
  }
) => {
  const schedules = JSON.parse(data.schedules?.toString() ?? "");
  return {
    id: data.id,
    location: data.location,
    name: data.name,
    thumbnailURI: data.thumbnailURI,
    cheapestTicketPrice: data.tickets.at(0)?.price ?? null,
    expensiveTicketPrice: data.tickets.at(-1)?.price ?? null,
    schedules,
  } as IListEventsDTO;
};

export const EventDetailMapper = (
  data: Event & {
    tickets: Ticket[];
  }
) => {
  const schedules = JSON.parse(data.schedules?.toString() ?? "");
  return {
    id: data.id,
    location: data.location,
    name: data.name,
    thumbnailURI: data.thumbnailURI,
    description: data.description,
    tickets: data.tickets.map((ticket) => ({
      id: ticket.id,
      name: ticket.name,
      price: ticket.price,
      stock: ticket.stock,
    })),
    schedules,
  } as IEventDetailDTO;
};
