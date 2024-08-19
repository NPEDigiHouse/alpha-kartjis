import { Request, Response, NextFunction } from 'express';
import { CallbackService } from '../../services/callback/callback';
import { constants, createResponse } from '../../utils';
import { InternalServerError } from '../../exceptions/InternalError';

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
            const data = req.body;

            if (!data) {
                throw new InternalServerError('kesalahan server');
            }

            await this.callbackService.(verifyPaymentdata);

            return res.json(createResponse(constants.SUCCESS_RESPONSE_MESSAGE));
        } catch (error) {
            return next(error);
        }
    }
}
