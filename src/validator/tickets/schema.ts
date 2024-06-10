import Joi from "joi";

export const TicketPayloadSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().min(0).required(),
  stock: Joi.number().min(0).optional(),
  adminFee: Joi.number().optional(),
  eventId: Joi.string().required(),
});

export const TicketPutPayloadSchema = Joi.object({
  name: Joi.string().optional(),
  price: Joi.number().min(0).optional(),
  stock: Joi.number().min(0).optional(),
  adminFee: Joi.number().min(0).optional(),
});
