export interface IPostTicketPayload {
  name: string;
  price: number;
  eventId: string;
  stock?: number;
  adminFee?: number;
}

export interface IPutTicketPayload {
  name?: string;
  price?: number;
  stock?: number;
  adminFee?: number;
}
