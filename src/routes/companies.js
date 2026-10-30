const express = require('express');
const authMiddleware = require('../middlewares/auth');
const validatePayload = require('../middlewares/validator');
const {
  PostCompanyPayloadSchema,
  PutCompanyPayloadSchema,
} = require('../validators/companies/schema');

const createCompaniesRouter = (companiesController) => {
  const router = express.Router();

  router.get('/', companiesController.getCompaniesHandler);
  router.get('/:id', companiesController.getCompanyByIdHandler);
  router.post('/', authMiddleware, validatePayload(PostCompanyPayloadSchema), companiesController.postCompanyHandler);
  router.put('/:id', authMiddleware, validatePayload(PutCompanyPayloadSchema), companiesController.putCompanyByIdHandler);
  router.delete('/:id', authMiddleware, companiesController.deleteCompanyByIdHandler);

  return router;
};

module.exports = createCompaniesRouter;
