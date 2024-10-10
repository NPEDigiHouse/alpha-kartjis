import { config } from '../../config';
import { BadRequestError } from '../../exceptions/BadRequestError';
import { NotFoundError } from '../../exceptions/NotFoundError';
import { EmailHelper } from '../../helper/EmailHelper';
import { Order } from '../../models/Order';
import { OrderDetailMapper } from '../../utils/dto/order';
import pug from 'pug';
import path from 'path';

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

        if (order.status === 'FAILED' || order.status === 'INPROCESS') {
            throw new BadRequestError('order has not been paid');
        }

        order?.orderDetails.forEach((od) => {
            const clientUrl = `https://kartjis.id/my-ticket/info/${od.id}`;
            const emailBody = {
                from: config.config().KARTJIS_MAIL,
                to: od.email,
                subject: `E-Kartjis [${order.Event?.name}] - ${od.name}`,
                // html: `<a href="${clientUrl}">${clientUrl}</a>`,
                html: pug.compileFile(
                    path.join(__dirname, '..', '..', '..', 'views/email.pug')
                )({
                    name: od.name,
                    ticketName: od.Ticket?.name,
                    orderNumber: order.id,
                    orderDate: new Date(order.createdAt),
                    paymentMethod: 'other',
                    redirectLink: clientUrl,
                }),
                text: '',
            };

            const emailHelper = new EmailHelper();
            setTimeout(() => {
                emailHelper.sendEmail(emailBody);
            }, (Math.floor(Math.random() * (10 - 1 + 1)) + 1) * 60 * 1000);
            // emailHelper.sendEmail(emailBody);
        });
    }

    async getOrderDetail(orderId: string) {
        const order = await this.model.getOrderById(orderId);

        if (!order) {
            throw new NotFoundError("order's not found");
        }

        return OrderDetailMapper(order);
    }
}
