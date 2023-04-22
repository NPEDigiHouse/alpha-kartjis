import { BadRequestError } from "../../exceptions/BadRequestError";
import { IPostCategoryPayload } from "../../utils/interface/category";
import { CategoryPayloadSchema } from "./schema";

export class CategoryPayloadValidator {
  validatePostPayload(payload: IPostCategoryPayload) {
    const validationResult = CategoryPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new BadRequestError(validationResult.error.message);
    }
  }
}
