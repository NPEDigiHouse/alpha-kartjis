import { Kafka } from "kafkajs";
import { Order } from "../models/Order";
import { Ticket } from "../models/Ticket";

const kafka = new Kafka({
  clientId: "mvp-kartjis",
  brokers: ["103.127.134.84:9094"]  // Replace with your broker address
});

const topic = 'mvpkartjis_sample_ordertx-event';
const produceTopic = "mvpkartjis_sample_sendingmail-event"
const groupId = 'mvpkartjis_sample_ordertx-event-w1';

const consumer = kafka.consumer({ groupId });
const producer = kafka.producer()
const orderModel = new Order();
const ticketModel = new Ticket();

// this.ticketConstruction.composeTicket(order, data.payment_type);


async function publishMessageOrderKafka(
  topic: string,
  message: { orderId: string, paymentType?: string }
) {
  try {
    await producer.connect()
    
    await producer.send({
      topic,
      messages: [
        { value: JSON.stringify(message) },
      ],
    });
    console.log('mail Sent to kafka');

  } catch (error) {
    console.log(error)
  } finally {
    await producer.disconnect()
  }
}

const run = async () => {
  // Connect the consumer
  await consumer.connect();
  await consumer.subscribe({ topic });

  // Disable auto commit and process messages
  await consumer.run({
    autoCommit: false,
    eachMessage: async ({ topic, partition, message }) => {
      try {
        const order: { orderId: string; isSuccess: boolean; paymentType?: string, reason?: string } = JSON.parse(message.value?.toString() ?? "")

        const orderDb = await orderModel.changePaymentStatusById(
          order.orderId,
          order.isSuccess,
          order.paymentType
        );

        if (orderDb && !order.isSuccess) {
          if (order) {
            // await this.ticketConstruction.composeTicket(order, data.payment_type);
  
            for (let i = 0; i < orderDb.orderDetails.length; i++) {
              ticketModel.reduceTicketBasedOnQuantityBought(
                orderDb.orderDetails[i].ticketId,
                1,
                "INC"
              );
            }
          }
        } else if (orderDb && order.isSuccess) {
          publishMessageOrderKafka(produceTopic, {orderId: order.orderId, paymentType: order.paymentType})
        }
        // Process the message here (e.g., saving to a database or performing a task)

        // Manually commit the offset after processing
        await consumer.commitOffsets([
          { topic, partition, offset: (parseInt(message.offset) + 1).toString() },
        ]);
      } catch (error) {
        console.error('Error processing message:', error);
        // Optionally, handle errors (e.g., retrying, logging, or skipping)
      }
    },
  });
};

run().catch(console.error);