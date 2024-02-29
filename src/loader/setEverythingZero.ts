import db from "../database";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

dotenv.config();

const setEverythingEvent = async () => {
// atlantis event
//  const event = await db.event.update({
//	    where: { id: "e4203ce3-23f1-459b-8e05-275d74486be7" },
//    data: {
//      schedules: JSON.stringify([
//        { startTime: 1714201200, endTime: 0 },
//      ]),
//      thumbnailURI: `${process.env.STATIC_SERVER}/uploaded-file/.png`,
//    },
//  });
const ticket = await db.ticket.update({
  where: {id: "e657312f-9715-4098-9d1d-93b2acd3d731"},
  data: {
    stock: 0
  }
})
};

setEverythingEvent();
