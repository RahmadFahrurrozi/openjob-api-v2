const Joi = require('joi');

const PostCompanyPayloadSchema = Joi.object({
  name: Joi.string().required(),
  location: Joi.string().required(),
  description: Joi.string().allow('', null).optional(),
});

const PutCompanyPayloadSchema = Joi.object({
  name: Joi.string().optional(),
  location: Joi.string().optional(),
  description: Joi.string().allow('', null).optional(),
}).min(1);

module.exports = { PostCompanyPayloadSchema, PutCompanyPayloadSchema };
