const Joi = require('joi');

const PostApplicationPayloadSchema = Joi.object({
  user_id: Joi.string().required(),
  job_id: Joi.string().required(),
  status: Joi.string().valid('pending', 'accepted', 'rejected').optional(),
});

const PutApplicationPayloadSchema = Joi.object({
  status: Joi.string().valid('pending', 'accepted', 'rejected').required(),
});

module.exports = { PostApplicationPayloadSchema, PutApplicationPayloadSchema };
