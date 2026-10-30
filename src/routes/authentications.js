const express = require('express');
const validatePayload = require('../middlewares/validator');
const authMiddleware = require('../middlewares/auth');
const {
  PostAuthPayloadSchema,
  PutAuthPayloadSchema,
  DeleteAuthPayloadSchema,
} = require('../validators/authentications/schema');

const createAuthenticationsRouter = (authenticationsController) => {
  const router = express.Router();

  router.post('/', validatePayload(PostAuthPayloadSchema), authenticationsController.postAuthenticationHandler);
  router.put('/', validatePayload(PutAuthPayloadSchema), authenticationsController.putAuthenticationHandler);
  router.delete('/', authMiddleware, validatePayload(DeleteAuthPayloadSchema), authenticationsController.deleteAuthenticationHandler);

  return router;
};

module.exports = createAuthenticationsRouter;
