import db from "../database";
import { v4 as uuidv4 } from "uuid";

const seedingDatabase = async () => {
  await db.ticketVerification.deleteMany({});
  await db.orderDetail.deleteMany({});
  await db.order.deleteMany({});
  await db.ticket.deleteMany({});
  await db.event.deleteMany({});
  await db.category.deleteMany({});
  await db.customer.deleteMany({});

  const category = await db.category.create({
    data: {
      id: uuidv4(),
      name: "music",
    },
  });

  const event = await db.event.create({
    data: {
      id: uuidv4(),
      name: "konser blackpink",
      location: "panlos",
      schedules: JSON.stringify([
        { startTime: 1682162511, endTime: 1682162511 },
      ]),
      categories: { connect: { id: category.id } },
    },
  });

  const tickets = await db.ticket.createMany({
    data: [
      {
        id: uuidv4(),
        name: "PRESALE",
        price: 100000,
        stock: 100,
        eventId: event.id,
      },
      {
        id: uuidv4(),
        name: "VIP",
        price: 1000000,
        stock: 25,
        eventId: event.id,
      },
      {
        id: uuidv4(),
        name: "REGULAR",
        price: 450000,
        stock: 1000,
        eventId: event.id,
      },
    ],
  });
};

seedingDatabase();
