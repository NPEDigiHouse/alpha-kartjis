interface ICustomer {
  name: string;
  email: string;
  birthDate?: number;
  phoneNumber: string;
  gender: "FEMALE" | "MALE";
}

interface ITicketPurchasement {
  ticketId: string;
  name: string;
  email: string;
  birthDate?: number;
  phoneNumber: string;
  gender: "FEMALE" | "MALE";
  quantity: number;
}

export interface IPutTicketPurchasementPayload {
  customerProfile: ICustomer;
  tickets: ITicketPurchasement[];
}
