export interface IPostTicketPayload {
  name: string;
  price: number;
  eventId: string;
  stock?: number;
  adminFee?: number;
}
