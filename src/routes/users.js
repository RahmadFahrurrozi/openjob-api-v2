const express = require('express');
const validatePayload = require('../middlewares/validator');
const { UserPayloadSchema } = require('../validators/users/schema');

const createUsersRouter = (usersController) => {
  const router = express.Router();

  router.post('/', validatePayload(UserPayloadSchema), usersController.postUserHandler);
  router.get('/:id', usersController.getUserByIdHandler);

  return router;
};

module.exports = createUsersRouter;
