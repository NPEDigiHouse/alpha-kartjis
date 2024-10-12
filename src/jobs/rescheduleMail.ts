// import { config } from "../config";
// import { EmailHelper } from "../helper/EmailHelper";
// import { readFile } from "fs/promises";
// import pug from "pug";
// import path from "path";
// import db from "../database";
// interface IEmailBody {
//   from?: string;
//   to: string;
//   subject: string;
//   text: string;
//   html: string;
//   attachments?: [
//     {
//       filename: string;
//       content: Buffer | string;
//     }
//   ];
// }

// const sendEmailTask = async (emailBody: IEmailBody) => {
//   const emailHelper = new EmailHelper();

//   emailHelper.sendEmail(emailBody);
// };

// // const clientUrl = `${process.env.KARTJIS_URL}/my-ticket/info/${orderDetail.id}`;

// const startTask = async () => {
//   const orders = await db.orderDetail.findMany({
//     where: {
//       Order: {
//         // eventId: "e0306093-b0ce-4f31-bb1e-ab8d1089095e",
//         eventId: "e495fb2c-f422-43bf-a815-2eb6967293e5",
//         status: "SUCCESS",
//       },
//       email: "yukiao.network@gmail.com",
//     },
//   });

//   orders.forEach(async (order) => {
//     sendEmailTask({
//       from: config.config().KARTJIS_MAIL,
//       to: order.email,
//       subject: `Reschedule Evocative`,
//       html: pug.compileFile(
//         path.join(__dirname, "..", "..", "views/announcement.pug")
//       )({
//         ticketLink: `${process.env.KARTJIS_URL}/my-ticket/info/${order.id}`,
//         infoLink:
//           "https://sds.kartjis.id/api/uploaded-file/reschedule-evocatifest.pdf",
//       }),
//       text: "",
//     });
//   });
// };

// startTask();
