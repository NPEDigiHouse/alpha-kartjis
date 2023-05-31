import db from "../database";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

dotenv.config();

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
      name: "ROAD TO Suara Dari Selatan",
      location: "LAPANGAN PARKIR LOT AMBALAT TRANS STUDIO MALL MAKASSAR",
      schedules: JSON.stringify([
        { startTime: 1689847200, endTime: 1689868740 },
      ]),
      categories: { connect: { id: category.id } },
      thumbnailURI: `${process.env.STATIC_SERVER}/uploaded-file/FULL.jpg`,
      description:
        "Suara dari selatan adalah selebrasi pertunjukan musik Indonesia yang ada di makasar! yang dimana diselenggarakan oleh Hawaii Indonesia. Acara musik ini akan hadir selama 1 hari dengan konsep Road to pada tanggal 20 JULI 2023 bertempat di Lap Parking Lot Ambalat Trans Studio Mall Makasar! Menampilkan dua LEGENDA musik indonesia.",
    },
  });

  const tickets = await db.ticket.createMany({
    data: [
      {
        id: uuidv4(),
        name: "REGULAR",
        price: 187000,
        stock: 5000,
        eventId: event.id,
      },
    ],
  });
};

seedingDatabase();
