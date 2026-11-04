const Joi = require('joi');

const PostCategoryPayloadSchema = Joi.object({
  name: Joi.string().trim().min(1).required(),
  description: Joi.string().allow('', null).optional(),
});

const PutCategoryPayloadSchema = Joi.object({
  name: Joi.string().trim().min(1).optional(),
  description: Joi.string().allow('', null).optional(),
}).min(1);

module.exports = { PostCategoryPayloadSchema, PutCategoryPayloadSchema };
