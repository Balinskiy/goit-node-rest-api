import Joi from "joi";

export const userRegisterSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().email().required(),
  subscription: Joi.string().valid("starter", "pro", "business").default("starter"),
});

export const userLoginSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().email().required(),
  subscription: Joi.string(),
});

export const userEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});
