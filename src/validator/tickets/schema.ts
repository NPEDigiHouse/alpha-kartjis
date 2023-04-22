import Joi from "joi";

export const TicketPayloadSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().min(0).required(),
  stock: Joi.number().min(0).optional(),
});
