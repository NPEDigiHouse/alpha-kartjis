// import amqlib from "amqplib";
// import { Order } from "../models/Order";
// import { Ticket } from "../models/Ticket";
// import { TicketConstruction } from "../services/facade/ticketConstruction";

// const main = async () => {
//   try {
//     const connection = await amqlib.connect("amqp://localhost");
//     const channel = await connection.createChannel();
//     const orderTopic = "order_payment";

//     channel.assertExchange(orderTopic, "topic", {
//       durable: true,
//     });

//     const queue = await channel.assertQueue("order_queue", {
//       durable: true,
//     });

//     channel.bindQueue(queue.queue, orderTopic, "core-payment");
//     channel.consume(
//       queue.queue,
//       async (msg: any) => {
//         const data = JSON.parse(msg.content.toString());
//         console.log(data);

//         const orderModel = new Order();
//         const ticketModel = new Ticket();
//         const ticketConstruction = new TicketConstruction();

//         if (!data.isSuccess) {
//           const order = await orderModel.changePaymentStatusById(
//             data.orderId,
//             data.isSuccess
//           );

//           if (order) {
//             for (let i = 0; i < order.orderDetails.length; i++) {
//               ticketModel.reduceTicketBasedOnQuantityBought(
//                 order.orderDetails[i].ticketId,
//                 1,
//                 "INC"
//               );
//             }
//           }
//         } else {
//           const order = await orderModel.changePaymentStatusById(
//             data.orderId,
//             data.isSuccess,
//             data.paymentType
//           );

//           if (order) {
//             ticketConstruction.composeTicket(order, data.payment_type);
//           }
//         }
//       },
//       { noAck: true }
//     );
//   } catch (error) {
//     console.error(error);
//   }
// };

// main();
