import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import db from "../database";
import { BadRequestError } from "../exceptions/BadRequestError";
import { InternalServerError } from "../exceptions/InternalError";
import { IPostEventPayload } from "../utils/interface/event";

export class Event {
  async addNewEvent(eventId: string, payload: IPostEventPayload) {
    try {
      const schedules = payload.schedules.map((sc) => ({
        startTime: sc.startTime,
        endTime: sc.endTime ?? null,
      }));

      const event = await db.event.create({
        data: {
          id: eventId,
          location: payload.location,
          name: payload.name,
          description: payload.description,
          thumbnailURI: payload.thumbnailURI,
          schedules: JSON.stringify(schedules),
          categories: {
            connect: payload.categories?.map((category) => ({ id: category })),
          },
        },
      });

      return event;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new BadRequestError(error.message);
      } else if (error instanceof Error) {
        throw new InternalServerError(error.message);
      }
    }
  }

  async getEventById(eventId: string) {
    return await db.event.findUnique({
      where: { id: eventId },
      include: {
        tickets: {
          orderBy: { price: "asc" },
        },
      },
    });
  }

  async getAllEvents() {
    return await db.event.findMany({
      include: {
        tickets: {
          orderBy: [{ price: "asc" }],
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }
}
