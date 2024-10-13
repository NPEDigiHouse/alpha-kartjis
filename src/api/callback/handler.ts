import { Request, Response, NextFunction } from "express";
import { CallbackService } from "../../services/callback/callback";
import { constants, createResponse } from "../../utils";
import { InternalServerError } from "../../exceptions/InternalError";
import { EmailHelper } from "../../helper/EmailHelper";

export class CallbackHandler {
  callbackService: CallbackService;

  constructor(emailHelper: EmailHelper) {
    this.callbackService = new CallbackService(emailHelper);

    this.postCallbackPaymentVerification =
      this.postCallbackPaymentVerification.bind(this);
  }

  async postCallbackPaymentVerification(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const data = req.body;

      if (!data) {
        throw new InternalServerError("kesalahan server");
      }

      await this.callbackService.verifyPayment(data);

      return res.json(createResponse(constants.SUCCESS_RESPONSE_MESSAGE));
    } catch (error) {
      return next(error);
    }
  }
}
