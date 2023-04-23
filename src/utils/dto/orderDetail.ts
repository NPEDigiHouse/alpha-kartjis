import {
  Order,
  Event,
  Customer,
  Ticket,
  OrderDetail,
  TicketVerification,
} from "@prisma/client";
import { IEventSchedule } from "../interface/event";

interface IOrderDetailDetailDTO {
  id: string;
  eventName: string;
  eventPlace: string;
  eventThumbnailURI?: string;
  schedules: IEventSchedule[];
  orderDate: Date;
  invoice: string;
  name: string;
  birthDate: number;
  gender: "FEMALE" | "MALE";
  hash?: string;
  barcodeURI?: string;
}

export const OrderDetailDetailMapper = (
  data: OrderDetail & {
    Order:
      | (Order & {
          Event: Event | null;
        })
      | null;
    TicketVerification: TicketVerification | null;
  }
) => {
  const schedules = JSON.parse(data.Order?.Event?.schedules?.toString() ?? "");
  return {
    id: data.id,
    eventName: data.Order?.Event?.name,
    eventPlace: data.Order?.Event?.location,
    eventThumbnailURI: data.Order?.Event?.thumbnailURI,
    orderDate: data.Order?.createdAt,
    invoice: data.Order?.id,
    birthDate: data.birthDate,
    gender: data.gender,
    name: data.name,
    hash: data.TicketVerification?.hash,
    barcodeURI: `${process.env.HOST}:${process.env.PORT}/api/ticket-verifications/${data.TicketVerification?.hash}`,
    schedules,
  } as IOrderDetailDetailDTO;
};
