import { Router } from 'express';
import homeController from './controllers/home.controller.js';
import authController from './controllers/auth.controller.js';
import projectController from './controllers/project.controller.js';

const routes = Router();

routes.use('/', homeController);
routes.use('/auth', authController);
routes.use('/projects', projectController);

export default routes;