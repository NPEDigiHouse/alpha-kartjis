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
  description?: string;
  quota?: number;
}

interface IEventDetailDTO {
  id: string;
  name: string;
  location: string;
  thumbnailURI?: string;
  schedules: IEventSchedule[];
  description?: string;
  tickets?: Ticket[];
  quota: number;
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
  commiteeName?: string;
  commiteeEmail?: string;
  commiteeEOName?: string;
  commiteePhoneNumber?: string;
}

export const ListEventMapper = (
  data: Event & {
    tickets: Ticket[];
  }
) => {
  let quota = 0;

  for (let i = 0; i < data.tickets.length; i++) {
    quota += data.tickets[i].stock;
  }

  const schedules = JSON.parse(data.schedules?.toString() ?? "");
  return {
    id: data.id,
    location: data.location,
    name: data.name,
    thumbnailURI: data.thumbnailURI,
    cheapestTicketPrice: data.tickets.at(0)?.price ?? null,
    expensiveTicketPrice: data.tickets.at(-1)?.price ?? null,
    description: data.description,
    quota,
    schedules,
  } as IListEventsDTO;
};

export const EventDetailMapper = (
  data: Event & {
    tickets: Ticket[];
  }
) => {
  const schedules = JSON.parse(data.schedules?.toString() ?? "");
  let quota = 0;

  for (let i = 0; i < data.tickets.length; i++) {
    quota += data.tickets[i].stock;
  }
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
      adminFee: ticket.adminFee,
    })),
    bankName: data.paymentBankName,
    bankAccountName: data.paymentAccountName,
    bankAccountNumber: data.paymentAccountNumber,
    commiteeName: data.commiteeName,
    commiteeEmail: data.commiteeEmail,
    commiteeEOName: data.commiteeEOName,
    commiteePhoneNumber: data.commiteePhoneNumber,
    schedules,
    quota,
  } as IEventDetailDTO;
};
