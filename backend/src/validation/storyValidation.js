const joi = require("joi");
const { validateRequest } = require("./uservalidation");
const createStorySchema = (req, res, next) => {
  const schema = joi.object({
    text: joi.string().max(350).required(),
    color: joi.string().optional(),
  });
  return validateRequest(req, next, schema);
};
const editStorySchema = (req, res, next) => {
  const schema = joi.object({
    text: joi.string().max(350).required(),
    isPublic: joi.binary().optional(),
    color: joi.string().optional(),
  });
  return validateRequest(req, next, schema);
};

module.exports = { createStorySchema, editStorySchema };
