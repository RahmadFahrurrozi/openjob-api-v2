class BookmarksController {
  constructor(bookmarksService) {
    this._bookmarksService = bookmarksService;

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
      const bookmarks = await this._bookmarksService.getBookmarksByUserId(userId);
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
