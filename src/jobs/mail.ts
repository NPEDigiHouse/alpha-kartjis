// import { config } from "../config";
// import { EmailHelper } from "../helper/EmailHelper";
// import { readFile } from "fs/promises";

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

// const startTask = async () => {
//   await sendEmailTask({
//     from: config.config().KARTJIS_MAIL,
//     to: "npedigital@gmail.com",
//     html: "DATA ORDER KARTJIS",
//     subject: "DATA ORDER KARTJIS",
//     text: "DATA ORDER KARTJIS",
//     attachments: [
//       {
//         filename: "orders.csv",
//         content: await readFile("/home/ubuntu/dbdump/orders.csv"),
//       },
//     ],
//   });
// };

// startTask();
