import db from "../database";
import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";

dotenv.config();

const setEverythingEvent = async () => {
// evocatifest event
  const event = await db.event.update({
	    where: { id: "e0306093-b0ce-4f31-bb1e-ab8d1089095e" },
    data: {
      schedules: JSON.stringify([
        { startTime: 1713416400, endTime: 0 },
      ]),
//      thumbnailURI: `${process.env.STATIC_SERVER}/uploaded-file/.png`,
    },
  });
//const ticket = await db.ticket.update({
//  where: {id: "e657312f-9715-4098-9d1d-93b2acd3d731"},
//  data: {
//    stock: 500
//  }
//})
};

setEverythingEvent();
