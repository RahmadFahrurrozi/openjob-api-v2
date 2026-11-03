class BookmarksController {
  constructor(bookmarksService, cacheService) {
    this._bookmarksService = bookmarksService;
    this._cacheService = cacheService;

    this.postBookmarkHandler = this.postBookmarkHandler.bind(this);
    this.getBookmarkByIdHandler = this.getBookmarkByIdHandler.bind(this);
    this.deleteBookmarkHandler = this.deleteBookmarkHandler.bind(this);
    this.getBookmarksHandler = this.getBookmarksHandler.bind(this);
  }

  async postBookmarkHandler(req, res, next) {
    try {
      const { id: userId } = req.user;
      const { jobId } = req.params;
      const id = await this._bookmarksService.addBookmark(userId, jobId);

      // Invalidate user bookmarks cache
      await this._cacheService.delete(`bookmarks:user:${userId}`);

      return res.status(201).json({
        status: 'success',
        message: 'Job berhasil di-bookmark',
        data: { id },
      });
    } catch (error) {
      next(error);
    }
  }

  async getBookmarkByIdHandler(req, res, next) {
    try {
      const { jobId, id } = req.params;
      const bookmark = await this._bookmarksService.getBookmarkById(id, jobId);
      return res.status(200).json({
        status: 'success',
        data: bookmark,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteBookmarkHandler(req, res, next) {
    try {
      const { id: userId } = req.user;
      const { jobId } = req.params;
      await this._bookmarksService.deleteBookmark(userId, jobId);

      // Invalidate user bookmarks cache
      await this._cacheService.delete(`bookmarks:user:${userId}`);

      return res.status(200).json({
        status: 'success',
        message: 'Bookmark berhasil dihapus',
      });
    } catch (error) {
      next(error);
    }
  }

  async getBookmarksHandler(req, res, next) {
    try {
      const { id: userId } = req.user;
      const cacheKey = `bookmarks:user:${userId}`;

      // Check cache first
      const cached = await this._cacheService.get(cacheKey);
      if (cached) {
        res.setHeader('X-Data-Source', 'cache');
        return res.status(200).json({
          status: 'success',
          data: { bookmarks: JSON.parse(cached) },
        });
      }

      // If cache miss, fetch from database
      const bookmarks =
        await this._bookmarksService.getBookmarksByUserId(userId);
      await this._cacheService.set(cacheKey, JSON.stringify(bookmarks), 3600);

      res.setHeader('X-Data-Source', 'database');
      return res.status(200).json({
        status: 'success',
        data: { bookmarks },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = BookmarksController;
