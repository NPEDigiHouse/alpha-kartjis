import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { ErrorHandler } from "./middleware/ErrorHandler";
import { EventRouter } from "./api/events/router";
import { CategoryRouter } from "./api/categories/router";
import { OrderRouter } from "./api/orders/router";
import { OrderDetailRouter } from "./api/orderDetails/router";
import { TicketVerificationRouter } from "./api/ticketVerification/router";
import { CallbackRouter } from "./api/callback/router";
import { StatsRouter } from "./api/stats/router";
import { EmailHelper } from "./helper/EmailHelper";
import { TicketConstruction } from "./services/facade/ticketConstruction";

dotenv.config();

class Server {
  private app: express.Application;

  constructor() {
    this.app = express();
  }

  config() {
    // Initialize Swagger with options
    this.app.set("views", "./views");
    this.app.set("view engine", "pug");

    this.app.disable("x-powered-by");
    this.app.use(function (req, res, next) {
      res.setHeader("Content-Security-Policy", "upgrade-insecure-requests");
      next();
    });

    this.app.use(cors());
    this.app.use(express.json());
    // this.app.get("/test", (req: Request, res: Response) => {
    //   res.render("email", {
    //     name: "Sony",
    //     ticketName: "Sound of the South",
    //     orderNumber: "Mx489s",
    //     orderDate: "20 November 2021 17.30",
    //     paymentMethod: "QRIS",
    //     redirectLink: "http://www.google.com"
    // })
    // })
    // * static file
    this.app.use(
      "/static",
      express.static(path.join(__dirname, "..", "static"))
    );
    this.app.use(
      "/api/uploaded-file",
      express.static(process.env.STATIC_URL ?? "media")
    );
    const emailHelper = new EmailHelper()
    const ticketConstruction = new TicketConstruction(emailHelper)
    // * api base route
    this.app.use("/api", new CallbackRouter(emailHelper).register());
    this.app.use("/api", new EventRouter().register());
    this.app.use("/api", new CategoryRouter().register());
    this.app.use("/api", new OrderRouter(emailHelper, ticketConstruction).register());
    this.app.use("/api", new OrderDetailRouter().register());
    this.app.use("/api", new TicketVerificationRouter().register());
    this.app.use("/api", new StatsRouter().register());
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
