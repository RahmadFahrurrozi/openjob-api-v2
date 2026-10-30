const express = require('express');
const authMiddleware = require('../middlewares/auth');
const validatePayload = require('../middlewares/validator');
const {
  PostJobPayloadSchema,
  PutJobPayloadSchema,
} = require('../validators/jobs/schema');

const createJobsRouter = (jobsController, bookmarksController) => {
  const router = express.Router();

  // Root collection
  router.get('/', jobsController.getJobsHandler);
  router.post('/', authMiddleware, validatePayload(PostJobPayloadSchema), jobsController.postJobHandler);

  // Sub-resource routes (Must be declared before /:id)
  router.get('/company/:companyId', jobsController.getJobsByCompanyIdHandler);
  router.get('/category/:categoryId', jobsController.getJobsByCategoryIdHandler);

  // Bookmark sub-routes for jobs
  router.post('/:jobId/bookmark', authMiddleware, bookmarksController.postBookmarkHandler);
  router.get('/:jobId/bookmark/:id', authMiddleware, bookmarksController.getBookmarkByIdHandler);
  router.delete('/:jobId/bookmark', authMiddleware, bookmarksController.deleteBookmarkHandler);

  // Single job resource
  router.get('/:id', jobsController.getJobByIdHandler);
  router.put('/:id', authMiddleware, validatePayload(PutJobPayloadSchema), jobsController.putJobByIdHandler);
  router.delete('/:id', authMiddleware, jobsController.deleteJobByIdHandler);

  return router;
};

module.exports = createJobsRouter;
