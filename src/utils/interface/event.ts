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

export interface IEvent {
  name: string;
  location: string;
  description?: string;
  thumbnailURI?: string;
  categories?: string[];
  schedules: IEventSchedule[];
}
