const express = require('express');
const authMiddleware = require('../middlewares/auth');
const validatePayload = require('../middlewares/validator');
const {
  PostJobPayloadSchema,
  PutJobPayloadSchema,
} = require('../validators/jobs/schema');

const createJobsRouter = (jobsController, bookmarksController) => {
  const router = express.Router();

  router.get('/', jobsController.getJobsHandler);
  router.post(
    '/',
    authMiddleware,
    validatePayload(PostJobPayloadSchema),
    jobsController.postJobHandler
  );

  router.get('/company/:companyId', jobsController.getJobsByCompanyIdHandler);
  router.get(
    '/category/:categoryId',
    jobsController.getJobsByCategoryIdHandler
  );

  router.post(
    '/:jobId/bookmark',
    authMiddleware,
    bookmarksController.postBookmarkHandler
  );
  router.get(
    '/:jobId/bookmark/:id',
    authMiddleware,
    bookmarksController.getBookmarkByIdHandler
  );
  router.delete(
    '/:jobId/bookmark',
    authMiddleware,
    bookmarksController.deleteBookmarkHandler
  );

  router.get('/:id', jobsController.getJobByIdHandler);
  router.put(
    '/:id',
    authMiddleware,
    validatePayload(PutJobPayloadSchema),
    jobsController.putJobByIdHandler
  );
  router.delete('/:id', authMiddleware, jobsController.deleteJobByIdHandler);

  return router;
};

module.exports = createJobsRouter;
