import { Order, Event, Customer, Ticket, OrderDetail } from "@prisma/client";
import { IEventSchedule } from "../interface/event";

interface IOrderDetailDetailDTO {
  id: string;
  eventName: string;
  eventPlace: string;
  eventThumbnailURI?: string;
  schedules: IEventSchedule[];
  orderDate: Date;
  orderDetails: OrderDetail[];
  paymentStatus: "INPROCESS" | "SUCCESS" | "FAILED";
}

export const OrderDetailMapper = (
  data: Order & {
    Event: Event | null;
    Customer: Customer | null;
    orderDetails: OrderDetail[];
  }
) => {
  const schedules = JSON.parse(data.Event?.schedules?.toString() ?? "");
  return {
    id: data.id,
    eventName: data.Event?.name,
    eventPlace: data.Event?.location,
    eventThumbnailURI: data.Event?.thumbnailURI,
    orderDate: data.createdAt,
    paymentStatus: data.status,
    orderDetails: data.orderDetails,
    schedules,
  } as IOrderDetailDetailDTO;
};
