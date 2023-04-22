import { BadRequestError } from "../../exceptions/BadRequestError";
import { IPostTicketPayload } from "../../utils/interface/ticket";
import { TicketPayloadSchema } from "./schema";

export class TicketPayloadValidator {
  validatePostPayload(payload: IPostTicketPayload) {
    const validationResult = TicketPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new BadRequestError(validationResult.error.message);
    }
  }
}
