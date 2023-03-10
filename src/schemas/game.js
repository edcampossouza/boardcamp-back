import Joi from "joi";

export const gameInput = Joi.object({
  name: Joi.string().required(),
  image: Joi.string().required(),
  stockTotal: Joi.number().positive().required(),
  pricePerDay: Joi.number().positive().required(),
});
