const express = require('express');
const authMiddleware = require('../middlewares/auth');
const validatePayload = require('../middlewares/validator');
const {
  PostApplicationPayloadSchema,
  PutApplicationPayloadSchema,
} = require('../validators/applications/schema');

const createApplicationsRouter = (applicationsController) => {
  const router = express.Router();

  // All application endpoints are protected
  router.use(authMiddleware);

  router.post('/', validatePayload(PostApplicationPayloadSchema), applicationsController.postApplicationHandler);
  router.get('/', applicationsController.getApplicationsHandler);

  // Sub-routes before /:id
  router.get('/user/:userId', applicationsController.getApplicationsByUserIdHandler);
  router.get('/job/:jobId', applicationsController.getApplicationsByJobIdHandler);

  router.get('/:id', applicationsController.getApplicationByIdHandler);
  router.put('/:id', validatePayload(PutApplicationPayloadSchema), applicationsController.putApplicationStatusHandler);
  router.delete('/:id', applicationsController.deleteApplicationByIdHandler);

  return router;
};

module.exports = createApplicationsRouter;
