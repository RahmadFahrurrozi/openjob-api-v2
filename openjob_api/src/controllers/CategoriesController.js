class CategoriesController {
  constructor(categoriesService) {
    this._categoriesService = categoriesService;

    this.postCategoryHandler = this.postCategoryHandler.bind(this);
    this.getCategoriesHandler = this.getCategoriesHandler.bind(this);
    this.getCategoryByIdHandler = this.getCategoryByIdHandler.bind(this);
    this.putCategoryByIdHandler = this.putCategoryByIdHandler.bind(this);
    this.deleteCategoryByIdHandler = this.deleteCategoryByIdHandler.bind(this);
  }

  async postCategoryHandler(req, res, next) {
    try {
      const id = await this._categoriesService.addCategory(req.body);
      return res.status(201).json({
        status: 'success',
        message: 'Kategori berhasil ditambahkan',
        data: { id },
      });
    } catch (error) {
      next(error);
    }
  }

  async getCategoriesHandler(req, res, next) {
    try {
      const categories = await this._categoriesService.getCategories();
      return res.status(200).json({
        status: 'success',
        data: { categories },
      });
    } catch (error) {
      next(error);
    }
  }

  async getCategoryByIdHandler(req, res, next) {
    try {
      const { id } = req.params;
      const category = await this._categoriesService.getCategoryById(id);
      return res.status(200).json({
        status: 'success',
        data: category,
      });
    } catch (error) {
      next(error);
    }
  }

  async putCategoryByIdHandler(req, res, next) {
    try {
      const { id } = req.params;
      await this._categoriesService.editCategoryById(id, req.body);
      return res.status(200).json({
        status: 'success',
        message: 'Kategori berhasil diperbarui',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCategoryByIdHandler(req, res, next) {
    try {
      const { id } = req.params;
      await this._categoriesService.deleteCategoryById(id);
      return res.status(200).json({
        status: 'success',
        message: 'Kategori berhasil dihapus',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CategoriesController;
