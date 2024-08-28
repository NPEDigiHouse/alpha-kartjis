import axios from "axios";
import dotenv from "dotenv";
import { config } from "../config";

dotenv.config();

export class PaymentHelper {
  constructor() {
    this.createBill = this.createBill.bind(this);
  }

  async createBill(orderId: string, amount: number) {
    try {
console.log("orderid" + orderId + config.config().MIDTRANS_SNAP_URL)
      const response = await axios.post(
        config.config().MIDTRANS_SNAP_URL ?? "",
        {
          transaction_details: {
            order_id: orderId,
            gross_amount: amount,
          },
          custom_field1: "core-payment",
        },
        {
          auth: {
            username: config.config().MIDTRANS_SERVER_KEY ?? "",
            password: "",
          },
        }
      );

      return response.data;
    } catch (error: any) {
      if (error.response.status !== 200 && error.response.status !== 201) {
        return null;
      }
    }
  }

  // !UNUSED: flip
  async createBillUnused() {
    const response = await axios.post(
      `${process.env.FLIP_TEST_URL}/pwf/bill`,
      {
        title: "tiket payment",
        type: "SINGLE",
        amount: 10000,
      },
      {
        headers: {
          Authorization: "Basic " + process.env.FLIP_AUTH,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return response.data;
  }
}
