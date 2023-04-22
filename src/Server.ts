import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ErrorHandler } from "./middleware/ErrorHandler";
import { EventRouter } from "./api/events/router";
import { CategoryRouter } from "./api/categories/router";

dotenv.config();

class Server {
  private app: express.Application;

  constructor() {
    this.app = express();
  }

  config() {
    this.app.disable("x-powered-by");
    this.app.use(cors());
    this.app.use(express.json());
    // * static file
    this.app.use("/uploaded-file", express.static("media"));
    // * api base route
    this.app.use("/api", new EventRouter().register());
    this.app.use("/api", new CategoryRouter().register());
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
