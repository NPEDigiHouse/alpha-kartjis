import Joi from "joi";

// id          String   @id
//   name        String?  @db.VarChar(255)
//   email       String   @db.VarChar(255)
//   birthDate   DateTime
//   phoneNumber String?
//   gender      Gender
//   orders      Order[]
//   createdAt   DateTime @default(now())
//   updatedAt   DateTime @updatedAt

const CustomerProfileSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string()
    .regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .required(),
  birthDate: Joi.number().required(),
  phoneNumber: Joi.string().required(),
  gender: Joi.string().valid("FEMALE", "MALE").required(),
});

const TicketPurchasementSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string()
    .regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .required(),
  birthDate: Joi.number().required(),
  phoneNumber: Joi.string().required(),
  gender: Joi.string().valid("FEMALE", "MALE").required(),
  ticketId: Joi.string().required(),
  quantity: Joi.number().min(1).required(),
  address: Joi.string().optional(),
  socialMedia: Joi.string().optional(),
  location: Joi.string().optional(),
});

export const TicketPurchasementPayloadSchema = Joi.object({
  customerProfile: CustomerProfileSchema.optional(),
  tickets: Joi.array().items(TicketPurchasementSchema).min(1).required(),
});
