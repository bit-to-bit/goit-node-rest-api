import Joi from "joi";

export const registerAuthSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().email().required(),
  subscription: Joi.string().valid("starter", "pro", "business"),
});

export const loginAuthSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().email().required(),
});

export const authEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});
