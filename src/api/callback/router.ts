import express, { Router } from "express";
import { CallbackHandler } from "./handler";
import { EmailHelper } from "../../helper/EmailHelper";

export class CallbackRouter {
  handler: CallbackHandler;
  path: string;
  router: Router;

  constructor(emailHelper: EmailHelper) {
    this.path = "/callback";
    this.router = Router();
    this.handler = new CallbackHandler(emailHelper);
  }

  register() {
    // * /callback/verify-payment
    this.router
      .route(this.path + "/verify-payment")
      .post(
        express.urlencoded({ extended: false }),
        this.handler.postCallbackPaymentVerification
      );

    return this.router;
  }
}
