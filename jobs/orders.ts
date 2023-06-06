import axios from "axios";
import dotenv from "dotenv";
import { config } from "../src/config";
import { Order } from "../src/models/Order";
import { Ticket } from "../src/models/Ticket";

dotenv.config();

const orderModel = new Order();
const ticketModel = new Ticket();

const handlePendingOrder = async (orderId: string) => {
  try {
    const response = await axios.get(
      `${config.config().MIDTRANS_API_URL ?? ""}/${orderId}/status`,
      {
        auth: {
          username: config.config().MIDTRANS_SERVER_KEY ?? "",
          password: "",
        },
      }
    );

    if (response.data.status_code === "404") {
      const order = await orderModel.changePaymentStatusById(orderId, false);

      if (order) {
        for (let i = 0; i < order.orderDetails.length; i++) {
          await ticketModel.reduceTicketBasedOnQuantityBought(
            order.orderDetails[i].ticketId,
            1,
            "INC"
          );
        }
      }

      return true;
    }

    return false;
  } catch (error: any) {
    console.error(error);
  }
};

const pendingOrderTask = async () => {
  const pendingOrders = await orderModel.getOrderByStatus("INPROCESS");

  pendingOrders.forEach(async (pendingOrder) => {
    await handlePendingOrder(pendingOrder.id);
  });
};

const startTask = async () => {
  await pendingOrderTask();
};

startTask();
