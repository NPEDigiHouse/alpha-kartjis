import { Router } from "express";
import { BaseRouter } from "../../routers/BaseRouter";
import { CategoryHandler } from "./handler";

export class CategoryRouter {
  handler: CategoryHandler;
  path: string;
  router: Router;

  constructor() {
    this.path = "/categories";
    this.router = Router();
    this.handler = new CategoryHandler();
  }

  register() {
    // * /categories
    this.router
      .route(this.path)
      .get(this.handler.getCategories)
      .post(this.handler.postCategories);

    return this.router;
  }
}
