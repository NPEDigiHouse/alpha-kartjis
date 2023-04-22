import Joi from "joi";

const ScheduleEventSchema = Joi.object({
  startTime: Joi.number().required(),
  endTime: Joi.number().optional(),
});

export const EventPayloadSchema = Joi.object({
  name: Joi.string().required(),
  location: Joi.string().required(),
  description: Joi.string().optional(),
  thumbnailURI: Joi.string().optional(),
  categories: Joi.array().items(Joi.string()).min(1).required(),
  schedules: Joi.array().items(ScheduleEventSchema).min(1).required(),
});
