import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().min(5).max(50).email().required(),
  password: Joi.string().min(8).max(20).required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().min(5).max(50).email().required(),
  password: Joi.string().min(8).max(20).required(),
});
