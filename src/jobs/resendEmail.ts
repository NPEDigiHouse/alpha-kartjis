import path from 'path';
import { config } from '../config';
import pug from 'pug';
import { EmailHelper } from '../helper/EmailHelper';
import { Order } from '../models/Order';

const main = async () => {
    const orderModel = new Order();
    const order = await orderModel.getOrderById('');

    order?.orderDetails.forEach((od) => {
        const clientUrl = `https://kartjis.id/my-ticket/info/${od.id}`;
        const emailBody = {
            from: config.config().KARTJIS_MAIL,
            to: od.email,
            subject: `E-Kartjis [${order.Event?.name}] - ${od.name}`,
            // html: `<a href="${clientUrl}">${clientUrl}</a>`,
            html: pug.compileFile(
                path.join(__dirname, '..', '..', 'views/email.pug')
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
        emailHelper.sendEmail(emailBody);
    });
};

main();
