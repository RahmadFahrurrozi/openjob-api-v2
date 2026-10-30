const express = require('express');
const authMiddleware = require('../middlewares/auth');
const uploadDocumentMiddleware = require('../middlewares/upload');

/**
 * Factory to create documents router.
 * @param {import('../controllers/DocumentsController')} documentsController
 */
const createDocumentsRouter = (documentsController) => {
  const router = express.Router();

  // Upload new document (Protected)
  router.post(
    '/',
    authMiddleware,
    uploadDocumentMiddleware,
    documentsController.postDocumentHandler
  );

  // Get all uploaded documents (Public)
  router.get('/', documentsController.getDocumentsHandler);

  // View / Download physical document file by ID (Public)
  router.get('/:id', documentsController.getDocumentByIdHandler);

  // Delete document and remove physical file (Protected)
  router.delete(
    '/:id',
    authMiddleware,
    documentsController.deleteDocumentByIdHandler
  );

  return router;
};

module.exports = createDocumentsRouter;

