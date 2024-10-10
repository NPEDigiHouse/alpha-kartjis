import { Event, Order, OrderDetail, Ticket } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { hashData } from "../../utils";
import { TicketVerification } from "../../models/TicketVerification";
import { EmailHelper } from "../../helper/EmailHelper";
import dotenv from "dotenv";
import pug from "pug";
import path from "path";
import { config } from "../../config";

dotenv.config();

interface IOrderDetail {
  orderDetailId: string;
  name: string;
  birthDate: number;
  phoneNumber: string;
  invoice: string;
  ticketId: string;
  orderDate: Date;
  gender: string;
  timestamp: number;
}

export class TicketConstruction {
  ticketVerificationModel: TicketVerification;
  emailHelper: EmailHelper;

  constructor() {
    this.ticketVerificationModel = new TicketVerification();
    this.emailHelper = new EmailHelper();
  }

  async composeTicket(
    order: Order & {
      Event: Event | null;
      orderDetails: (OrderDetail & { Ticket: Ticket | null })[] | [];
    },
    paymentType: string
  ) {
    for (let i = 0; i < order.orderDetails?.length; i++) {
      const id = uuidv4();
      const orderDetail = order.orderDetails[i];
      const data = {
        orderDetailId: orderDetail.id,
        timestamp: Date.now(),
        birthDate: orderDetail.birthDate,
        gender: orderDetail.gender,
        invoice: orderDetail.orderId,
        phoneNumber: orderDetail.phoneNumber,
        name: orderDetail.name,
        ticketId: orderDetail.ticketId,
        orderDate: order.createdAt,
      } as IOrderDetail;
      const hash = hashData(
        JSON.stringify(data),
        "md5",
        process.env.HASHED_SALT
      );

      await this.ticketVerificationModel.addNewVerification(
        id,
        hash,
        orderDetail.id
      );

      const clientUrl = `${process.env.KARTJIS_URL}/my-ticket/info/${orderDetail.id}`;
      const emailBody = {
        from: config.config().KARTJIS_MAIL,
        to: orderDetail.email,
        subject: `E-Kartjis [${order.Event?.name}] - ${orderDetail.name}`,
        // html: `<a href="${clientUrl}">${clientUrl}</a>`,
        html: pug.compileFile(
          path.join(__dirname, "..", "..", "..", "views/email.pug")
        )({
          name: orderDetail.name,
          ticketName: order.Event?.name,
          orderNumber: order.id,
          orderDate: new Date(order.createdAt),
          paymentMethod: paymentType,
          redirectLink: clientUrl,
        }),
        text: "",
      };
      setTimeout(() => {
        this.emailHelper.sendEmail(emailBody);
      }, 5 * 60 * 1000);
      // this.emailHelper.sendEmail(emailBody);
    }
  }
}
