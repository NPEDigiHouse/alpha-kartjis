import { config } from "../../config";
import { BadRequestError } from "../../exceptions/BadRequestError";
import { NotFoundError } from "../../exceptions/NotFoundError";
import { EmailHelper } from "../../helper/EmailHelper";
import { Order } from "../../models/Order";
import { OrderDetailMapper } from "../../utils/dto/order";
import pug from "pug";
import path from "path";
import { TicketConstruction } from "../facade/ticketConstruction";

export class OrderService {
  model: Order;

  constructor() {
    this.model = new Order();
  }

  async sendEmailToOder(orderId: string) {
    const order = await this.model.getOrderById(orderId);

    if (!order) {
      throw new NotFoundError("order's not found");
    }

    if (order.status === "FAILED" || order.status === "INPROCESS") {
      throw new BadRequestError("order has not been paid")
    }

    // const ticketConstruction = new TicketConstruction();
    // await ticketConstruction.composeTicket(order, "other");

    const uniqueEmail: string[] = []
    for (let i = 0; i < order.orderDetails.length; i++) {
      const orderDetail = order.orderDetails[i];

      if (!uniqueEmail.find(e => e == orderDetail.email)) {
        const clientUrl = `https://kartjis.id/my-ticket/info/${orderDetail.id}`;
        const emailBody = {
          from: config.config().KARTJIS_MAIL,
          to: orderDetail.email,
          subject: `E-Tiket ${order.Event?.name} - ${orderDetail.name}`,
          // html: `<a href="${clientUrl}">${clientUrl}</a>`,
          html: pug.compileFile(
            path.join(__dirname, "..", "..", "..", "views/email.pug")
          )({
            name: orderDetail.name,
            ticketName: orderDetail.Ticket?.name,
            orderNumber: order.id,
            orderDate: new Date(order.createdAt),
            paymentMethod: "other",
            redirectLink: clientUrl,
          }),
          text: "",
        };

        uniqueEmail.push(orderDetail.email)
        const emailHelper = new EmailHelper();
        setTimeout(() => {
          emailHelper.sendEmail(emailBody, orderDetail.orderId);
        }, (Math.floor(Math.random() * (5 - 1 + 1)) + 1) * 60 * 1000);
      }

    }
    // order?.orderDetails.forEach((od) => {
    //   const clientUrl = `https://kartjis.id/my-ticket/info/${orderDetail.id}`;
    //   const emailBody = {
    //     from: config.config().KARTJIS_MAIL,
    //     to: orderDetail.email,
    //     subject: `E-Tiket [${order.Event?.name}] - ${orderDetail.name}`,
    //     // html: `<a href="${clientUrl}">${clientUrl}</a>`,
    //     html: pug.compileFile(
    //       path.join(__dirname, "..", "..", "..", "views/email.pug")
    //     )({
    //       name: orderDetail.name,
    //       ticketName: orderDetail.Ticket?.name,
    //       orderNumber: order.id,
    //       orderDate: new Date(order.createdAt),
    //       paymentMethod: "other",
    //       redirectLink: clientUrl,
    //     }),
    //     text: "",
    //   };

    //   const emailHelper = new EmailHelper();
    //   setTimeout(() => {
    //     emailHelper.sendEmail(emailBody);
    //   }, (Math.floor(Math.random() * (5 - 1 + 1)) + 1) * 60 * 1000);
    //   // emailHelper.sendEmail(emailBody);
    // });
  }

  async getOrderDetail(orderId: string) {
    const order = await this.model.getOrderById(orderId);

    if (!order) {
      throw new NotFoundError("order's not found");
    }

    return OrderDetailMapper(order);
  }
}
