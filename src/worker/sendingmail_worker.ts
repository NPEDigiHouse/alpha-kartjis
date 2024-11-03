import { Kafka, KafkaMessage } from "kafkajs";
import fs from 'fs';
import { Order } from "../models/Order";
import { TicketConstruction } from "../services/facade/ticketConstruction";
import { EmailHelper } from "../helper/EmailHelper";
import path from "path";

const kafka = new Kafka({
  clientId: "mvp-kartjis",
  brokers: ["103.127.134.84:9094"]  // Replace with your broker address
});

const topic = "mvpkartjis_sample_sendingmail-event"
const groupId = 'mvpkartjis_sample_sendingmail-event-w1';

const orderModel = new Order();
const emailHelper = new EmailHelper()
const ticketConstruction = new TicketConstruction(emailHelper);
const consumer = kafka.consumer({ groupId });

// Function to log errors into a file
function logErrorToFile(email: string, error: any): void {
  const logFilePath = path.join(__dirname, '..', '..', 'sendingmail_errors.log');
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


const run = async () => {
  // Connect the consumer
  await consumer.connect();
  await consumer.subscribe({ topic });

  let counter = 0; // Counter to track processed messages

  let messageBuffer : KafkaMessage[] = []
  // Disable auto commit and process messages
  await consumer.run({
    autoCommit: false,
    eachMessage: async ({ topic, partition, message }) => {
      messageBuffer.push(message)
    },
  });

  const intervalId = setInterval(async () => {
    if (messageBuffer.length > 0) {
      for (let i = 0; i < messageBuffer.length; i++) {
        const message = messageBuffer[i];
        
        try {
          const order = JSON.parse(message.value?.toString() ?? "");
          
          // Check if the order ID exists
          const orderDb = await orderModel.getOrderById(order.orderId);
    
          if (orderDb && orderDb.status === "SUCCESS") {
            await ticketConstruction.composeTicket(order.orderId, order.paymentType ?? "");
            counter++;
          } else {
            logErrorToFile(order.orderId, "status is not success");
          }
    
          // Manually commit the offset after processing
          await consumer.commitOffsets([
            { topic, partition: 0, offset: (parseInt(message.offset) + 1).toString() },
          ]);
    
          // Stop processing after a certain count
          if (counter >= 3) {
            console.log("Processed 3 orders, exiting...");
            process.exit(0); // Exit after processing
          }
        } catch (error) {
          console.error('Error processing message:', error);
        }
      }
    }
    
  }, 10 * 1000);

  // Cleanup interval on exit
  process.on('exit', () => {
    clearInterval(intervalId);
  });
};

run().catch(console.error);

