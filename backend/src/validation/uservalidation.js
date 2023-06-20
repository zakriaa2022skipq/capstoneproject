const joi = require("joi");

const registerUserSchema = (req, res, next) => {
  const schema = joi.object({
    name: joi.string().required(),
    email: joi.string().email().required(),
    username: joi.string().required(),
    password: joi.string().min(5).max(30).required(),
  });
  return validateRequest(req, next, schema);
};

const loginUserSchema = (req, res, next) => {
  const schema = joi.object({
    username: joi.string().required(),
    password: joi.string().min(5).max(30).required(),
  });
  return validateRequest(req, next, schema);
};

const validateRequest = async (req, next, schema) => {
  try {
    const value = await schema.validateAsync(req.body);
    next();
  } catch (error) {
    const errMsg = error.details.map((val) => val.message).join(", ");
    req.statusCode = 400;
    next({ message: `Validation Error: ${errMsg}` });
  }
};

module.exports = { registerUserSchema, loginUserSchema, validateRequest };
