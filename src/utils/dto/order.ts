import { Order, Event, Customer, Ticket, OrderDetail } from "@prisma/client";
import { IEventSchedule } from "../interface/event";

interface IOrderDetailDetailDTO {
  id: string;
  eventName: string;
  eventPlace: string;
  eventThumbnailURI?: string;
  schedules: IEventSchedule[];
  orderDate: Date;
  orderDetails: IOrderDetail[];
  paymentStatus: "INPROCESS" | "SUCCESS" | "FAILED";
}

interface IOrderDetail {
  id: string;
  ticketId?: string;
  quantity?: number;
  orderId?: string;
  ticketName?: string;
  price?: number;
  email: string;
}

export const OrderDetailMapper = (
  data: Order & {
    orderDetails: (OrderDetail & {
      Ticket: Ticket | null;
    })[];
    Customer: Customer | null;
    Event: Event | null;
  }
) => {
  const schedules = JSON.parse(data.Event?.schedules?.toString() ?? "");
  const orderDetails: IOrderDetail[] = [];

  for (let i = 0; i < data.orderDetails.length; i++) {
    let duplicate = false;
    for (let j = 0; j < orderDetails.length; j++) {
      duplicate = data.orderDetails[i].ticketId === orderDetails[j].ticketId;
      if (duplicate) {
        break;
      }
    }

    if (!duplicate) {
      orderDetails.push({
        id: data.orderDetails[i].id,
        orderId: data.orderDetails[i].orderId ?? undefined,
        price: data.orderDetails[i].Ticket?.price,
        quantity: data.orderDetails[i].quantity,
        ticketId: data.orderDetails[i].ticketId ?? undefined,
        ticketName: data.orderDetails[i].Ticket?.name,
        email: data.orderDetails[i].email,
      });
    }
  }

  return {
    id: data.id,
    eventName: data.Event?.name,
    eventPlace: data.Event?.location,
    eventThumbnailURI: data.Event?.thumbnailURI,
    orderDate: data.createdAt,
    paymentStatus: data.status,
    orderDetails,
    schedules,
  } as IOrderDetailDetailDTO;
};
