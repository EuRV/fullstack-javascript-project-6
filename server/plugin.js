import { fileURLToPath } from 'url';
import path from 'path';
import fastifyView from '@fastify/view';
import Pug from 'pug';

import addRoutes from './routes/index.js';

const __dirname = fileURLToPath(path.dirname(import.meta.url));

const setUpViews = (app) => {
  app.register(fastifyView, {
    engine: {
      pug: Pug,
    },
    includeViewExtension: true,
    templates: path.join(__dirname, '..', 'server', 'views'),
  });
};

export default async (app, _opts) => {
  setUpViews(app);
  addRoutes(app);
};
