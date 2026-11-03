const express = require('express');
const authMiddleware = require('../middlewares/auth');
const uploadDocumentMiddleware = require('../middlewares/upload');

const createDocumentsRouter = (documentsController) => {
  const router = express.Router();

  router.post(
    '/',
    authMiddleware,
    uploadDocumentMiddleware,
    documentsController.postDocumentHandler
  );

  router.get('/', documentsController.getDocumentsHandler);

  router.get('/:id', documentsController.getDocumentByIdHandler);

  router.delete(
    '/:id',
    authMiddleware,
    documentsController.deleteDocumentByIdHandler
  );

  return router;
};

module.exports = createDocumentsRouter;
