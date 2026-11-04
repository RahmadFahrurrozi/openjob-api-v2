const express = require('express');
const authMiddleware = require('../middlewares/auth');

const createProfileRouter = (profileController) => {
  const router = express.Router();

  router.use(authMiddleware);

  router.get('/', profileController.getProfileHandler);
  router.get('/applications', profileController.getProfileApplicationsHandler);
  router.get('/bookmarks', profileController.getProfileBookmarksHandler);

  return router;
};

module.exports = createProfileRouter;
