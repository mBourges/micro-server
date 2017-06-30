const Joi = require('joi');

const createUserSchema = Joi.object({
  Firstname: Joi.string().required(),
  Lastname: Joi.string().required(),
  Email: Joi.string().email().required(),
  Password: Joi.string().required(),
  IsAdmin: Joi.boolean()
});

const updateUserSchema = Joi.object({
  Firstname: Joi.string().required(),
  Lastname: Joi.string().required(),
  Email: Joi.string().email().required(),
  IsAdmin: Joi.boolean()
});

const authenticateUserSchema = Joi.object({
  Email: Joi.string().required(),
  Password: Joi.string().required()
});

module.exports = authenticateUserSchema;

module.exports = {
  createUserSchema,
  updateUserSchema,
  authenticateUserSchema
};
