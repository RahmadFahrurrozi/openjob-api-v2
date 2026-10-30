class UsersController {
  constructor(usersService) {
    this._usersService = usersService;

    this.postUserHandler = this.postUserHandler.bind(this);
    this.getUserByIdHandler = this.getUserByIdHandler.bind(this);
  }

  async postUserHandler(req, res, next) {
    try {
      const id = await this._usersService.addUser(req.body);
      return res.status(201).json({
        status: 'success',
        message: 'User berhasil ditambahkan',
        data: { id },
      });
    } catch (error) {
      next(error);
    }
  }

  async getUserByIdHandler(req, res, next) {
    try {
      const { id } = req.params;
      const user = await this._usersService.getUserById(id);
      return res.status(200).json({
        status: 'success',
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UsersController;
