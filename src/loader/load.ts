import db from "../database";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

dotenv.config();

const loadDataToDatabase = async () => {
  const event = await db.event.create({
    data: {
      id: uuidv4(),
      name: "BERNYAYI BERMASA",
      location: "Makassar (TBA)",
      schedules: JSON.stringify([
        { startTime: 1691146800, endTime: 1691164740 },
      ]),
      thumbnailURI: `${process.env.STATIC_SERVER}/uploaded-file/FULL.jpg`,
      description:
        "Bernyanyi Bermasa merupakan karaoke event yang diadakan oleh Masa Kreatif bekerjasama dengan Authenticity dengan tujuan memberikan ruang bagi kita semua untuk berkumpul, bernyanyi, dan bersenang-senang bersama. Kali ini akan dipandu oleh Marlo Ernesto dan akan diiringi oleh Fian Rynaldy,pada tanggal 4 Agustus 2023.",
    },
  });

  const tickets = await db.ticket.createMany({
    data: [
      {
        id: uuidv4(),
        name: "REGULAR",
        price: 75000,
        adminFee: 5000,
        stock: 5000,
        eventId: event.id,
      },
    ],
  });
};

loadDataToDatabase();
