class JobsController {
  constructor(jobsService) {
    this._jobsService = jobsService;

    this.postJobHandler = this.postJobHandler.bind(this);
    this.getJobsHandler = this.getJobsHandler.bind(this);
    this.getJobByIdHandler = this.getJobByIdHandler.bind(this);
    this.getJobsByCompanyIdHandler = this.getJobsByCompanyIdHandler.bind(this);
    this.getJobsByCategoryIdHandler = this.getJobsByCategoryIdHandler.bind(this);
    this.putJobByIdHandler = this.putJobByIdHandler.bind(this);
    this.deleteJobByIdHandler = this.deleteJobByIdHandler.bind(this);
  }

  async postJobHandler(req, res, next) {
    try {
      const id = await this._jobsService.addJob(req.body);
      return res.status(201).json({
        status: 'success',
        message: 'Job berhasil ditambahkan',
        data: { id },
      });
    } catch (error) {
      next(error);
    }
  }

  async getJobsHandler(req, res, next) {
    try {
      const { title } = req.query;
      const companyName = req.query['company-name'] || req.query.companyName;

      const jobs = await this._jobsService.getJobs({ title, companyName });

      return res.status(200).json({
        status: 'success',
        data: { jobs },
      });
    } catch (error) {
      next(error);
    }
  }

  async getJobByIdHandler(req, res, next) {
    try {
      const { id } = req.params;
      const job = await this._jobsService.getJobById(id);
      return res.status(200).json({
        status: 'success',
        data: job,
      });
    } catch (error) {
      next(error);
    }
  }

  async getJobsByCompanyIdHandler(req, res, next) {
    try {
      const { companyId } = req.params;
      const jobs = await this._jobsService.getJobsByCompanyId(companyId);
      return res.status(200).json({
        status: 'success',
        data: { jobs },
      });
    } catch (error) {
      next(error);
    }
  }

  async getJobsByCategoryIdHandler(req, res, next) {
    try {
      const { categoryId } = req.params;
      const jobs = await this._jobsService.getJobsByCategoryId(categoryId);
      return res.status(200).json({
        status: 'success',
        data: { jobs },
      });
    } catch (error) {
      next(error);
    }
  }

  async putJobByIdHandler(req, res, next) {
    try {
      const { id } = req.params;
      await this._jobsService.editJobById(id, req.body);
      return res.status(200).json({
        status: 'success',
        message: 'Job berhasil diperbarui',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteJobByIdHandler(req, res, next) {
    try {
      const { id } = req.params;
      await this._jobsService.deleteJobById(id);
      return res.status(200).json({
        status: 'success',
        message: 'Job berhasil dihapus',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = JobsController;
