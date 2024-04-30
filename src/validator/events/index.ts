import { BadRequestError } from "../../exceptions/BadRequestError";
import {
  IPostEventPayload,
  IPutEventPayload,
} from "../../utils/interface/event";
import { EventPayloadSchema } from "./schema";

export class EventPayloadValidator {
  validatePostPayload(payload: IPostEventPayload) {
    const validationResult = EventPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new BadRequestError(validationResult.error.message);
    }
  }

  validatePutPayload(payload: IPutEventPayload) {
    const validationResult = EventPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new BadRequestError(validationResult.error.message);
    }
  }
}
