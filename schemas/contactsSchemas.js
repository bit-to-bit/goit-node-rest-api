import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(new RegExp(/^\(\d{3}\)\s\d{3}-\d{4}$/), "(XXX) XXX-XXXX")
    .required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string(),
  email: Joi.string().email(),
  phone: Joi.string().pattern(
    new RegExp(/^\(\d{3}\)\s\d{3}-\d{4}$/),
    "(XXX) XXX-XXXX"
  ),
});

