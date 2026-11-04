class UsersController {
  constructor(usersService, cacheService) {
    this._usersService = usersService;
    this._cacheService = cacheService;

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
      const cacheKey = `users:${id}`;

      const cached = await this._cacheService.get(cacheKey);
      if (cached) {
        res.setHeader('X-Data-Source', 'cache');
        return res.status(200).json({
          status: 'success',
          data: JSON.parse(cached),
        });
      }

      const user = await this._usersService.getUserById(id);
      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      await this._cacheService.set(cacheKey, JSON.stringify(userData), 3600);

      res.setHeader('X-Data-Source', 'database');
      return res.status(200).json({
        status: 'success',
        data: userData,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = UsersController;
