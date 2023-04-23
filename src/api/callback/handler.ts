import { Request, Response, NextFunction } from "express";
import { CallbackService } from "../../services/callback/callback";
import { constants, createResponse } from "../../utils";
import { InternalServerError } from "../../exceptions/InternalError";
import { BadRequestError } from "../../exceptions/BadRequestError";

export class CallbackHandler {
  callbackService: CallbackService;

  constructor() {
    this.callbackService = new CallbackService();

    this.postCallbackPaymentVerification =
      this.postCallbackPaymentVerification.bind(this);
  }

  async postCallbackPaymentVerification(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { data, token } = req.body;

      if (!data || !token) {
        throw new InternalServerError("kesalahan server");
      }

      await this.callbackService.verifyPayment(data, token);

      return res.json(createResponse(constants.SUCCESS_RESPONSE_MESSAGE));
    } catch (error) {
      return next(error);
    }
  }
}
