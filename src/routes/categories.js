const express = require('express');
const authMiddleware = require('../middlewares/auth');
const validatePayload = require('../middlewares/validator');
const {
  PostCategoryPayloadSchema,
  PutCategoryPayloadSchema,
} = require('../validators/categories/schema');

const createCategoriesRouter = (categoriesController) => {
  const router = express.Router();

  router.get('/', categoriesController.getCategoriesHandler);
  router.get('/:id', categoriesController.getCategoryByIdHandler);
  router.post('/', authMiddleware, validatePayload(PostCategoryPayloadSchema), categoriesController.postCategoryHandler);
  router.put('/:id', authMiddleware, validatePayload(PutCategoryPayloadSchema), categoriesController.putCategoryByIdHandler);
  router.delete('/:id', authMiddleware, categoriesController.deleteCategoryByIdHandler);

  return router;
};

module.exports = createCategoriesRouter;
