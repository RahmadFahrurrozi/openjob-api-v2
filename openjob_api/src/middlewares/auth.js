const TokenManager = require('../tokenize/TokenManager');
const AuthenticationError = require('../exceptions/AuthenticationError');

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AuthenticationError('Missing authentication token');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw new AuthenticationError('Missing authentication token');
    }

    const decoded = TokenManager.verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = authMiddleware;
