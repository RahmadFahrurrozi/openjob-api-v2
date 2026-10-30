const express = require('express');
const errorHandler = require('./middlewares/errorHandler');
const TokenManager = require('./tokenize/TokenManager');

// Services
const UsersService = require('./services/UsersService');
const AuthenticationsService = require('./services/AuthenticationsService');
const CompaniesService = require('./services/CompaniesService');
const CategoriesService = require('./services/CategoriesService');
const JobsService = require('./services/JobsService');
const ApplicationsService = require('./services/ApplicationsService');
const BookmarksService = require('./services/BookmarksService');
const DocumentsService = require('./services/DocumentsService');

// Controllers
const UsersController = require('./controllers/UsersController');
const AuthenticationsController = require('./controllers/AuthenticationsController');
const CompaniesController = require('./controllers/CompaniesController');
const CategoriesController = require('./controllers/CategoriesController');
const JobsController = require('./controllers/JobsController');
const ApplicationsController = require('./controllers/ApplicationsController');
const BookmarksController = require('./controllers/BookmarksController');
const ProfileController = require('./controllers/ProfileController');
const DocumentsController = require('./controllers/DocumentsController');

// Routers
const createUsersRouter = require('./routes/users');
const createAuthenticationsRouter = require('./routes/authentications');
const createCompaniesRouter = require('./routes/companies');
const createCategoriesRouter = require('./routes/categories');
const createJobsRouter = require('./routes/jobs');
const createApplicationsRouter = require('./routes/applications');
const createBookmarksRouter = require('./routes/bookmarks');
const createProfileRouter = require('./routes/profile');
const createDocumentsRouter = require('./routes/documents');

const createApp = () => {
  const app = express();

  app.use(express.json());

  // Instantiate services
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const companiesService = new CompaniesService();
  const categoriesService = new CategoriesService();
  const jobsService = new JobsService();
  const applicationsService = new ApplicationsService();
  const bookmarksService = new BookmarksService();
  const documentsService = new DocumentsService();

  // Instantiate controllers
  const usersController = new UsersController(usersService);
  const authenticationsController = new AuthenticationsController(
    authenticationsService,
    usersService,
    TokenManager
  );
  const companiesController = new CompaniesController(companiesService);
  const categoriesController = new CategoriesController(categoriesService);
  const bookmarksController = new BookmarksController(bookmarksService);
  const jobsController = new JobsController(jobsService);
  const applicationsController = new ApplicationsController(applicationsService);
  const profileController = new ProfileController(
    usersService,
    applicationsService,
    bookmarksService
  );
  const documentsController = new DocumentsController(documentsService);

  // Welcome route
  app.get('/', (req, res) => {
    res.status(200).json({
      status: 'success',
      message: 'Selamat datang di OpenJob RESTful API',
    });
  });

  // Mount routes
  app.use('/users', createUsersRouter(usersController));
  app.use('/authentications', createAuthenticationsRouter(authenticationsController));
  app.use('/companies', createCompaniesRouter(companiesController));
  app.use('/categories', createCategoriesRouter(categoriesController));
  app.use('/jobs', createJobsRouter(jobsController, bookmarksController));
  app.use('/applications', createApplicationsRouter(applicationsController));
  app.use('/bookmarks', createBookmarksRouter(bookmarksController));
  app.use('/profile', createProfileRouter(profileController));
  app.use('/documents', createDocumentsRouter(documentsController));

  // 404 Route Handler
  app.use((req, res) => {
    res.status(404).json({
      status: 'failed',
      message: 'Resource tidak ditemukan',
    });
  });

  // Centralized Error Handling Middleware
  app.use(errorHandler);

  return app;
};

module.exports = createApp;
