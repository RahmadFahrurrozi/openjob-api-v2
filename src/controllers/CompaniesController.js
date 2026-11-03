class CompaniesController {
  constructor(companiesService, cacheService) {
    this._companiesService = companiesService;
    this._cacheService = cacheService;

    this.postCompanyHandler = this.postCompanyHandler.bind(this);
    this.getCompaniesHandler = this.getCompaniesHandler.bind(this);
    this.getCompanyByIdHandler = this.getCompanyByIdHandler.bind(this);
    this.putCompanyByIdHandler = this.putCompanyByIdHandler.bind(this);
    this.deleteCompanyByIdHandler = this.deleteCompanyByIdHandler.bind(this);
  }

  async postCompanyHandler(req, res, next) {
    try {
      const id = await this._companiesService.addCompany(req.body);
      await this._cacheService.delete(`companies:${id}`);

      return res.status(201).json({
        status: 'success',
        message: 'Perusahaan berhasil ditambahkan',
        data: { id },
      });
    } catch (error) {
      next(error);
    }
  }

  async getCompaniesHandler(req, res, next) {
    try {
      const companies = await this._companiesService.getCompanies();
      return res.status(200).json({
        status: 'success',
        data: { companies },
      });
    } catch (error) {
      next(error);
    }
  }

  async getCompanyByIdHandler(req, res, next) {
    try {
      const { id } = req.params;
      const cacheKey = `companies:${id}`;

      const cached = await this._cacheService.get(cacheKey);
      if (cached) {
        res.setHeader('X-Data-Source', 'cache');
        return res.status(200).json({
          status: 'success',
          data: JSON.parse(cached),
        });
      }

      const company = await this._companiesService.getCompanyById(id);
      await this._cacheService.set(cacheKey, JSON.stringify(company), 3600);

      res.setHeader('X-Data-Source', 'database');
      return res.status(200).json({
        status: 'success',
        data: company,
      });
    } catch (error) {
      next(error);
    }
  }

  async putCompanyByIdHandler(req, res, next) {
    try {
      const { id } = req.params;
      await this._companiesService.editCompanyById(id, req.body);

      await this._cacheService.delete(`companies:${id}`);

      return res.status(200).json({
        status: 'success',
        message: 'Perusahaan berhasil diperbarui',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteCompanyByIdHandler(req, res, next) {
    try {
      const { id } = req.params;
      await this._companiesService.deleteCompanyById(id);

      await this._cacheService.delete(`companies:${id}`);

      return res.status(200).json({
        status: 'success',
        message: 'Perusahaan berhasil dihapus',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CompaniesController;
