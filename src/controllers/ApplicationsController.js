class ApplicationsController {
  constructor(applicationsService) {
    this._applicationsService = applicationsService;

    this.postApplicationHandler = this.postApplicationHandler.bind(this);
    this.getApplicationsHandler = this.getApplicationsHandler.bind(this);
    this.getApplicationByIdHandler = this.getApplicationByIdHandler.bind(this);
    this.getApplicationsByUserIdHandler = this.getApplicationsByUserIdHandler.bind(this);
    this.getApplicationsByJobIdHandler = this.getApplicationsByJobIdHandler.bind(this);
    this.putApplicationStatusHandler = this.putApplicationStatusHandler.bind(this);
    this.deleteApplicationByIdHandler = this.deleteApplicationByIdHandler.bind(this);
  }

  async postApplicationHandler(req, res, next) {
    try {
      const id = await this._applicationsService.addApplication(req.body);
      return res.status(201).json({
        status: 'success',
        message: 'Lamaran berhasil diajukan',
        data: { id },
      });
    } catch (error) {
      next(error);
    }
  }

  async getApplicationsHandler(req, res, next) {
    try {
      const applications = await this._applicationsService.getApplications();
      return res.status(200).json({
        status: 'success',
        data: { applications },
      });
    } catch (error) {
      next(error);
    }
  }

  async getApplicationByIdHandler(req, res, next) {
    try {
      const { id } = req.params;
      const application = await this._applicationsService.getApplicationById(id);
      return res.status(200).json({
        status: 'success',
        data: application,
      });
    } catch (error) {
      next(error);
    }
  }

  async getApplicationsByUserIdHandler(req, res, next) {
    try {
      const { userId } = req.params;
      const applications = await this._applicationsService.getApplicationsByUserId(userId);
      return res.status(200).json({
        status: 'success',
        data: { applications },
      });
    } catch (error) {
      next(error);
    }
  }

  async getApplicationsByJobIdHandler(req, res, next) {
    try {
      const { jobId } = req.params;
      const applications = await this._applicationsService.getApplicationsByJobId(jobId);
      return res.status(200).json({
        status: 'success',
        data: { applications },
      });
    } catch (error) {
      next(error);
    }
  }

  async putApplicationStatusHandler(req, res, next) {
    try {
      const { id } = req.params;
      await this._applicationsService.editApplicationStatusById(id, req.body);
      return res.status(200).json({
        status: 'success',
        message: 'Status lamaran berhasil diperbarui',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteApplicationByIdHandler(req, res, next) {
    try {
      const { id } = req.params;
      await this._applicationsService.deleteApplicationById(id);
      return res.status(200).json({
        status: 'success',
        message: 'Lamaran berhasil dihapus',
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = ApplicationsController;
