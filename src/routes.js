import { Router } from 'express';
import homeController from './controllers/home.controller.js';

const routes = Router();

routes.use('/', homeController);

export default routes;