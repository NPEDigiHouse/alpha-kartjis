import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export class PaymentHelper {
  constructor() {
    this.createBill = this.createBill.bind(this);
  }

  async createBill(orderId: string, amount: number) {
    const response = await axios.post(
      process.env.MIDTRANS_SNAP_URL ?? "",
      {
        transaction_details: {
          order_id: orderId,
          gross_amount: amount,
        },
      },
      {
        auth: {
          username: process.env.MIDTRANS_SERVER_KEY ?? "",
          password: "",
        },
      }
    );

    return response.data;
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
