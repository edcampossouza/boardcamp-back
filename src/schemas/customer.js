import Joi from "joi";

export const customerInput = Joi.object({
  name: Joi.string().required(),
  cpf: Joi.string()
    .pattern(/^[0-9]{11}$/)
    .required(),
  phone: Joi.string()
    .pattern(/^[0-9]{10,11}$/)
    .required(),
  birthday: Joi.string().pattern(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/),
});
