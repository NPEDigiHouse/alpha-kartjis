import { BadRequestError } from "../../exceptions/BadRequestError";
import {
  IPostTicketPayload,
  IPutTicketPayload,
} from "../../utils/interface/ticket";
import { TicketPayloadSchema, TicketPutPayloadSchema } from "./schema";

export class TicketPayloadValidator {
  validatePostPayload(payload: IPostTicketPayload) {
    const validationResult = TicketPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new BadRequestError(validationResult.error.message);
    }
  }

  validatePutPayload(payload: IPutTicketPayload) {
    const validationResult = TicketPutPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new BadRequestError(validationResult.error.message);
    }
  }
}
