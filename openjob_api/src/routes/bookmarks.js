const express = require('express');
const authMiddleware = require('../middlewares/auth');

const createBookmarksRouter = (bookmarksController) => {
  const router = express.Router();

  router.get('/', authMiddleware, bookmarksController.getBookmarksHandler);

  return router;
};

module.exports = createBookmarksRouter;
