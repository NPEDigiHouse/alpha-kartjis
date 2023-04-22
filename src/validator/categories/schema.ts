import Joi from "joi";

export const CategoryPayloadSchema = Joi.object({
  name: Joi.string().required(),
});
