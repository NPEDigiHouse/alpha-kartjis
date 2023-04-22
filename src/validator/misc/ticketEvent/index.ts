import { BadRequestError } from "../../../exceptions/BadRequestError";
import { IPutTicketPurchasementPayload } from "../../../utils/interface/misc/ticketEvent";
import { TicketPurchasementPayloadSchema } from "./schema";

export class TicketPurchasementValidator {
  validatePutPayload(payload: IPutTicketPurchasementPayload) {
    const validationResult = TicketPurchasementPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new BadRequestError(validationResult.error.message);
    }
  }
}
