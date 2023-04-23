import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ErrorHandler } from "./middleware/ErrorHandler";
import { EventRouter } from "./api/events/router";
import { CategoryRouter } from "./api/categories/router";
import { OrderRouter } from "./api/orders/router";
import { OrderDetailRouter } from "./api/orderDetails/router";
import { TicketVerificationRouter } from "./api/ticketVerification/router";

dotenv.config();

class Server {
  private app: express.Application;

  constructor() {
    this.app = express();
  }

  config() {
    // Initialize Swagger with options
    this.app.disable("x-powered-by");
    this.app.use(cors());
    this.app.use(express.json());
    // * static file
    this.app.use("/uploaded-file", express.static("media"));
    // * api base route
    this.app.use("/api", new EventRouter().register());
    this.app.use("/api", new CategoryRouter().register());
    this.app.use("/api", new OrderRouter().register());
    this.app.use("/api", new OrderDetailRouter().register());
    this.app.use("/api", new TicketVerificationRouter().register());
    // * error handling
    this.app.use(ErrorHandler);
  }

  start() {
    // this.registerRoutes();
    this.config();

    this.app.listen(
      Number(process.env.PORT) ?? 5000,
      process.env.HOST ?? "127.0.0.1",
      () => {
        console.log(
          `server is running on ${process.env.HOST}:${process.env.PORT}`
        );
      }
    );
  }
}

export const server = new Server();
