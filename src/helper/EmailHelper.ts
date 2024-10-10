import dotenv from "dotenv";
import nodemailer from "nodemailer";
import { config } from "../config";
import fs from 'fs';
import path from 'path';
import { ImapFlow } from 'imapflow';

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
function logErrorToFile(email: string, error: Error): void {
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

export class EmailHelper {
  transporter: nodemailer.Transporter;
  imapClient: ImapFlow

  constructor() {
    // Create a transport object using SMTP for Gmail
    // this.transporter = nodemailer.createTransport({
    //   service: "gmail",
    //   auth: {
    //     user: config.config().KARTJIS_MAIL, // Your Gmail email address
    //     pass: config.config().KARTJIS_PASSWORD, // Your Gmail email password
    //   },
    // });

    this.transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      auth: {
        user: config.config().KARTJIS_MAIL, // Your Gmail email address
        pass: config.config().KARTJIS_PASSWORD, // Your Gmail email password
      },
    });

    this.imapClient = new ImapFlow({
      host: 'imap.hostinger.com', // Your IMAP server
      port: 993, // IMAP port (usually 993 for TLS)
      secure: true,
      auth: {
        user: config.config().KARTJIS_MAIL ?? "", // Your Gmail email address
        pass: config.config().KARTJIS_PASSWORD ?? "", // Your Gmail email password
      },
    });
    
  }

  

  sendEmail(emailBody: IEmailBody) {
    // Send the email using the transporter
    this.transporter.sendMail(emailBody, async (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        logErrorToFile(emailBody.to, error)
      } else {
        try {
          await this.imapClient.connect()
              const message = `From: ${emailBody.from}\r\nTo: ${emailBody.to}\r\nSubject: ${emailBody.subject}\r\nContent-Type: text/html; charset="UTF-8"\r\n\r\n${emailBody.html}`;
          // Append the email to the "Sent" folder
          await this.imapClient.append('Sent', message);
          console.log("Email sent:", info.response);
        } catch (error: any) {
          console.error("Error saving mail:", error);
          logErrorToFile(emailBody.to, error)
        } finally {
          await this.imapClient.logout()
        }
      }
    });
  }
}
