import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { config } from "../config";
import fs from 'fs';
import path from 'path';
// import { ImapFlow } from 'imapflow';
import axios from "axios";

dotenv.config();

interface IEmailBody {
  from?: string;
  to: string;
  subject: string;
  text: string;
  html: string;
  attachments?: [
    {
      filename: string;
      content: Buffer | string;
    }
  ];
}

// Function to log errors into a file
function logErrorToFile(email: string, error: any): void {
  const logFilePath = path.join(__dirname, '..', '..', 'email_errors.log');
  const logMessage = `[${new Date().toISOString()}] Error sending email to: ${email}\nError: ${error.message}\n\n`;

  // Append the error log to the file
  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error("Failed to write to log file:", err);
    } else {
      console.log("Error logged to file.");
    }
  });
}

// Function to log errors into a file
function logSuccessToFile(message: any): void {
  const logFilePath = path.join(__dirname, '..', '..', 'email_success.log');
  const logMessage = `[${new Date().toISOString()}] ${message}\n\n`;

  // Append the error log to the file
  fs.appendFile(logFilePath, logMessage, (err) => {
    if (err) {
      console.error("Failed to write to log file:", err);
    } else {
      console.log("Error logged to file.");
    }
  });
}

export class EmailHelper {
  transporter: nodemailer.Transporter;
  // ** ini buat hostinger
  // imapClient: ImapFlow

  constructor() {
    // Create a transport object using SMTP for Gmail
    // this.transporter = nodemailer.createTransport({
    //   service: "gmail",
    //   auth: {
    //     user: config.config().KARTJIS_MAIL, // Your Gmail email address
    //     pass: config.config().KARTJIS_PASSWORD, // Your Gmail email password
    //   },
    // });


    // ** ini buat hostinger
    this.transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      auth: {
        user: config.config().KARTJIS_MAIL, // Your Gmail email address
        pass: config.config().KARTJIS_PASSWORD, // Your Gmail email password
      },
      greetingTimeout: 1000 * 60 * 2,
      maxConnections: 3,
      maxMessages: 100,
      rateDelta: 1000,
      rateLimit: 1,
      connectionTimeout: 1000 * 60 * 2,
      pool: true,
    });

    // this.imapClient = new ImapFlow({
    //   host: 'imap.hostinger.com', // Your IMAP server
    //   port: 993, // IMAP port (usually 993 for TLS)
    //   secure: true,
    //   auth: {
    //     user: config.config().KARTJIS_MAIL ?? "", // Your Gmail email address
    //     pass: config.config().KARTJIS_PASSWORD ?? "", // Your Gmail email password
    //   },
    // });

    // this.imapClient.connect().then(v => console.log(v))
  }

  async sendEmail(emailBody: IEmailBody, orderId?: string | null) {
    // Send the email using the transporter
    for (let i = 0; i < 3; i++) {
      try {
        if (this.transporter.isIdle()) {
          const info = await this.transporter.sendMail(emailBody)

          // if (!this.imapClient.usable) {
          //   await this.imapClient.connect()
          // }

          const message = `From: ${emailBody.from}\r\nTo: ${emailBody.to}\r\nSubject: ${emailBody.subject}\r\n\r\n${emailBody.html}`;
          // Append the email to the "Sent" folder
          // await this.imapClient.append('Sent', message);
          console.log("Email sent:", info.response);
          const successMessage = `Successfully send email from ${emailBody.from} to ${emailBody.to}, ${emailBody.subject} with orderId ${orderId}`
          logSuccessToFile(successMessage)
          // await axios.post("https://ntfy.sh/successfull-kartjis-mail", successMessage)
        }
        break
      } catch (error: any) {
        console.error("Error sending email:", error);
        const failedMessage = `Failed send email from ${emailBody.from} to ${emailBody.to}, ${emailBody.subject}. Error: ${error} with orderId ${orderId}`
        logErrorToFile(emailBody.to, failedMessage)
        logErrorToFile(emailBody.to, error)
        // await axios.post("https://ntfy.sh/failed-kartjis-mail", failedMessage)
      }
    }
    // this.transporter.sendMail(emailBody, async (error, info) => {
    //   if (error) {
    // console.error("Error sending email:", error);
    // logErrorToFile(emailBody.to, error)
    // const failedMessage = `Failed send email from ${emailBody.from} to ${emailBody.to}, ${emailBody.subject}. Error: ${error} with orderId ${orderId}`
    // await axios.post("https://ntfy.sh/failed-kartjis-mail", failedMessage)
    // }
    // else {
    //   const successMessage = `Successfully send email from ${emailBody.from} to ${emailBody.to}, ${emailBody.subject} with orderId ${orderId}`
    //   await axios.post("https://ntfy.sh/successfull-kartjis-mail", successMessage)
    // }
    // ** ini buat hostinger
    // else {
    //   try {
    //   if (!this.imapClient.usable) {
    //     await this.imapClient.connect()
    //   }
    //   const message = `From: ${emailBody.from}\r\nTo: ${emailBody.to}\r\nSubject: ${emailBody.subject}\r\n\r\n${emailBody.html}`;
    //   // Append the email to the "Sent" folder
    //   await this.imapClient.append('Sent', message);
    //   console.log("Email sent:", info.response);
    //   const successMessage = `Successfully send email from ${emailBody.from} to ${emailBody.to}, ${emailBody.subject} with orderId ${orderId}`
    //   await axios.post("https://ntfy.sh/successfull-kartjis-mail", successMessage)
    // } catch (error: any) {
    //   console.error("Error saving mail:", error);
    //   logErrorToFile(emailBody.to, error)
    // } finally {
    // }
  }
  // });
}
// }
