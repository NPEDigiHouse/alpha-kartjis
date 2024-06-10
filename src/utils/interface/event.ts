export interface IEventSchedule {
  startTime: Date | number;
  endTime?: Date | number;
}

export interface IPostEventPayload {
  name: string;
  location: string;
  description?: string;
  thumbnailURI?: string;
  categories?: string[];
  schedules: IEventSchedule[];
}

export interface IPutEventPayload {
  name?: string;
  location?: string;
  description?: string;
  thumbnailURI?: string;
  categories?: string[];
  schedules?: IEventSchedule[];
  bankName?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
  commiteeName?: string;
  commiteeEmail?: string;
  commiteeEOName?: string;
  commiteePhoneNumber?: string;
}

export interface IEvent {
  name: string;
  location: string;
  description?: string;
  thumbnailURI?: string;
  categories?: string[];
  schedules: IEventSchedule[];
}
