class ApplicationsController {
  constructor(applicationsService, cacheService, producerService) {
    this._applicationsService = applicationsService;
    this._cacheService = cacheService;
    this._producerService = producerService;

    this.postApplicationHandler = this.postApplicationHandler.bind(this);
    this.getApplicationsHandler = this.getApplicationsHandler.bind(this);
    this.getApplicationByIdHandler = this.getApplicationByIdHandler.bind(this);
    this.getApplicationsByUserIdHandler =
      this.getApplicationsByUserIdHandler.bind(this);
    this.getApplicationsByJobIdHandler =
      this.getApplicationsByJobIdHandler.bind(this);
    this.putApplicationStatusHandler =
      this.putApplicationStatusHandler.bind(this);
    this.deleteApplicationByIdHandler =
      this.deleteApplicationByIdHandler.bind(this);
  }

  async postApplicationHandler(req, res, next) {
    try {
      const application = await this._applicationsService.addApplication(
        req.body
      );

      if (this._producerService) {
        await this._producerService.sendMessage(
          'openjob:applications',
          JSON.stringify({ application_id: application.id })
        );
      }

      await this._cacheService.delete([
        `applications:user:${req.body.user_id}`,
        `applications:job:${req.body.job_id}`,
      ]);

      return res.status(201).json({
        status: 'success',
        message: 'Lamaran berhasil diajukan',
        data: {
          id: application.id,
          user_id: application.user_id,
          job_id: application.job_id,
          status: application.status,
        },
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
      const cacheKey = `applications:${id}`;

      const cached = await this._cacheService.get(cacheKey);
      if (cached) {
        res.setHeader('X-Data-Source', 'cache');
        return res.status(200).json({
          status: 'success',
          data: JSON.parse(cached),
        });
      }

      const application =
        await this._applicationsService.getApplicationById(id);
      await this._cacheService.set(cacheKey, JSON.stringify(application), 3600);

      res.setHeader('X-Data-Source', 'database');
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
      const cacheKey = `applications:user:${userId}`;

      const cached = await this._cacheService.get(cacheKey);
      if (cached) {
        res.setHeader('X-Data-Source', 'cache');
        return res.status(200).json({
          status: 'success',
          data: { applications: JSON.parse(cached) },
        });
      }

      const applications =
        await this._applicationsService.getApplicationsByUserId(userId);
      await this._cacheService.set(
        cacheKey,
        JSON.stringify(applications),
        3600
      );

      res.setHeader('X-Data-Source', 'database');
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
      const cacheKey = `applications:job:${jobId}`;

      const cached = await this._cacheService.get(cacheKey);
      if (cached) {
        res.setHeader('X-Data-Source', 'cache');
        return res.status(200).json({
          status: 'success',
          data: { applications: JSON.parse(cached) },
        });
      }

      const applications =
        await this._applicationsService.getApplicationsByJobId(jobId);
      await this._cacheService.set(
        cacheKey,
        JSON.stringify(applications),
        3600
      );

      res.setHeader('X-Data-Source', 'database');
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
      const updated = await this._applicationsService.editApplicationStatusById(
        id,
        req.body
      );

      await this._cacheService.delete([
        `applications:${id}`,
        `applications:user:${updated.user_id}`,
        `applications:job:${updated.job_id}`,
      ]);

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
      const deleted = await this._applicationsService.deleteApplicationById(id);

      await this._cacheService.delete([
        `applications:${id}`,
        `applications:user:${deleted.user_id}`,
        `applications:job:${deleted.job_id}`,
      ]);

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
