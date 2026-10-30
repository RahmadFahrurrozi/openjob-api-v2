const jwt = require('jsonwebtoken');
const InvariantError = require('../exceptions/InvariantError');
const AuthenticationError = require('../exceptions/AuthenticationError');

const TokenManager = {
  generateAccessToken: (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, {
      expiresIn: process.env.ACCESS_TOKEN_AGE ? parseInt(process.env.ACCESS_TOKEN_AGE, 10) : '3h',
    });
  },

  generateRefreshToken: (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_KEY);
  },

  verifyRefreshToken: (refreshToken) => {
    try {
      const artifacts = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY);
      return artifacts;
    } catch (error) {
      throw new InvariantError('Refresh token tidak valid');
    }
  },

  verifyAccessToken: (accessToken) => {
    try {
      const artifacts = jwt.verify(accessToken, process.env.ACCESS_TOKEN_KEY);
      return artifacts;
    } catch (error) {
      throw new AuthenticationError('Missing or invalid authentication token');
    }
  },
};

module.exports = TokenManager;
