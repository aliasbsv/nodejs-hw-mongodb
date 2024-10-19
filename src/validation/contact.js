import Joi from 'joi';
export const contactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Contact name must be a string',
    'string.min': 'Contact name must be at least 3 characters long',
    'string.max': 'Contact name must be at most 20 characters long',
    'any.required': 'Contact name is required',
  }),
  phoneNumber: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Contact phone number must be a string',
    'string.min': 'Contact phone number must be at least 3 characters long',
    'string.max': 'Contact phone number must be at most 20 characters long',
    'any.required': 'Contact phone number is required',
  }),
  email: Joi.string().min(3).max(20).email().messages({
    'string.base': 'Contact email must be a string',
    'string.min': 'Contact email must be at least 3 characters long',
    'string.max': 'Contact email must be at most 20 characters long',
    'string.email': 'Contact email must be a valid email address',
    'any.required': 'Contact email is required',
  }),
  isFavourite: Joi.boolean().messages({
    'boolean.base': 'Favourite should be a boolean',
  }),
  contactType: Joi.string().valid('work', 'home', 'personal').required().messages({
    'string.base': 'Contact type must be a string',
    'any.required': 'Contact type is required',
    'any.only': 'Contact type must be one of work, home, or personal',
  }),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).messages({
    'string.base': 'Username should be a string',
    'string.min': 'Username should have at least {#limit} characters',
    'string.max': 'Username should have at most {#limit} characters',
  }),
  phoneNumber: Joi.string().min(3).max(20).messages({
    'string.base': 'Phone number should be a string',
    'string.min': 'Phone number should have at least {#limit} characters',
    'string.max': 'Phone number should have at most {#limit} characters',
  }),
  email: Joi.string().min(3).max(20).messages({
    'string.base': 'Email should be a string',
    'string.min': 'Email should have at least {#limit} characters',
    'string.max': 'Email should have at most {#limit} characters',
  }),
  isFavourite: Joi.boolean().messages({
    'boolean.base': 'Favourite should be a boolean',
  }),
  contactType: Joi.string().valid('work', 'home', 'personal').messages({
    'string.base': 'Contact type should be a string',
    'any.only': 'Contact type must be one of [work, home, personal]',
  }),
});
