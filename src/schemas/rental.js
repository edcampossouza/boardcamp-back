import Joi from "joi";

export const rentalInput = Joi.object({
  customerId: Joi.number().positive().integer().required(),
  gameId: Joi.number().positive().integer().required(),
  daysRented: Joi.number().positive().integer().required(),
});
