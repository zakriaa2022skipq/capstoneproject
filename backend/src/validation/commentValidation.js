const joi = require("joi");
const { validateRequest } = require("./uservalidation");
const createCommentSchema = (req, res, next) => {
  const schema = joi.object({
    text: joi.string().max(50).required(),
  });
  return validateRequest(req, next, schema);
};
const editCommentSchema = (req, res, next) => {
  const schema = joi.object({
    text: joi.string().max(50).required(),
  });
  return validateRequest(req, next, schema);
};

module.exports = { createCommentSchema, editCommentSchema };
