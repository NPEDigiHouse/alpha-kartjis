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
  ticketName?: string;
  orderDetails?: IOrderDetail[];
}

interface IOrderDetail {
  id: string;
  ticketId?: string;
  quantity?: number;
  orderId?: string;
  ticketName?: string;
  price?: number;
}

export const OrderDetailDetailMapper = (
  data: OrderDetail & {
    Order:
      | (Order & {
          Event: Event | null;
          orderDetails: (OrderDetail & {
            Ticket: Ticket | null;
          })[];
        })
      | null;
    TicketVerification: TicketVerification | null;
    Ticket: Ticket | null;
  }
) => {
  const schedules = JSON.parse(data.Order?.Event?.schedules?.toString() ?? "");

  const orderDetails: IOrderDetail[] = [];
  const orderDetailDb = data.Order?.orderDetails ?? [];

  if (orderDetailDb[0]) {
    orderDetails.push({
      id: orderDetailDb[0].id,
      orderId: orderDetailDb[0].orderId ?? undefined,
      price: orderDetailDb[0].Ticket?.price,
      quantity: orderDetailDb[0].quantity,
      ticketId: orderDetailDb[0].ticketId ?? undefined,
      ticketName: orderDetailDb[0].Ticket?.name,
    });
  }

  for (let i = 0; i < orderDetailDb.length; i++) {
    let duplicate = false;
    for (let j = 0; j < orderDetails.length; j++) {
      duplicate = orderDetailDb[i].ticketId === orderDetails[j].ticketId;
      if (duplicate) {
        break;
      }
    }

    if (!duplicate) {
      orderDetails.push({
        id: orderDetailDb[i].id,
        orderId: orderDetailDb[i].orderId ?? undefined,
        price: orderDetailDb[i].Ticket?.price,
        quantity: orderDetailDb[i].quantity,
        ticketId: orderDetailDb[i].ticketId ?? undefined,
        ticketName: orderDetailDb[i].Ticket?.name,
      });
    }
  }

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
    ticketName: data.Ticket?.name,
    schedules,
    orderDetails,
  } as IOrderDetailDetailDTO;
};
