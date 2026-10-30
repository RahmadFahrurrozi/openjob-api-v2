class CompaniesController {
  constructor(companiesService) {
    this._companiesService = companiesService;

    this.postCompanyHandler = this.postCompanyHandler.bind(this);
    this.getCompaniesHandler = this.getCompaniesHandler.bind(this);
    this.getCompanyByIdHandler = this.getCompanyByIdHandler.bind(this);
    this.putCompanyByIdHandler = this.putCompanyByIdHandler.bind(this);
    this.deleteCompanyByIdHandler = this.deleteCompanyByIdHandler.bind(this);
  }

  async postCompanyHandler(req, res, next) {
    try {
      const id = await this._companiesService.addCompany(req.body);
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
      const company = await this._companiesService.getCompanyById(id);
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
