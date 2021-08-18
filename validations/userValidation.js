const Joi = require("joi");

function validateUser(user) {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    gender: Joi.string().required(),
    password: Joi.string().min(8).required()
  });

  return schema.validate(user);
}

module.exports = validateUser;
