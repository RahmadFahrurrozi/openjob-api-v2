class ProfileController {
  constructor(usersService, applicationsService, bookmarksService) {
    this._usersService = usersService;
    this._applicationsService = applicationsService;
    this._bookmarksService = bookmarksService;

    this.getProfileHandler = this.getProfileHandler.bind(this);
    this.getProfileApplicationsHandler = this.getProfileApplicationsHandler.bind(this);
    this.getProfileBookmarksHandler = this.getProfileBookmarksHandler.bind(this);
  }

  async getProfileHandler(req, res, next) {
    try {
      const { id } = req.user;
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

  async getProfileApplicationsHandler(req, res, next) {
    try {
      const { id } = req.user;
      const applications = await this._applicationsService.getApplicationsByUserId(id);
      return res.status(200).json({
        status: 'success',
        data: { applications },
      });
    } catch (error) {
      next(error);
    }
  }

  async getProfileBookmarksHandler(req, res, next) {
    try {
      const { id } = req.user;
      const bookmarks = await this._bookmarksService.getBookmarksByUserId(id);
      return res.status(200).json({
        status: 'success',
        data: { bookmarks },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ProfileController;
