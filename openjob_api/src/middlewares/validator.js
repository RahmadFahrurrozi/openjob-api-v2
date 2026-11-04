const InvariantError = require('../exceptions/InvariantError');

const validatePayload = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    throw new InvariantError(error.message);
  }
  next();
};

module.exports = validatePayload;
