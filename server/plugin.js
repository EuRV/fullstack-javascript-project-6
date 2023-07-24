// EARLYBIRDSSQL10
import { fileURLToPath } from 'url';
import path from 'path';
import fastifyStatic from '@fastify/static';
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
    defaultContext: {
      assetPath: (filename) => `/assets/${filename}`,
    },
    templates: path.join(__dirname, '..', 'server', 'views'),
  });
};

const setUpStaticAssets = (app) => {
  const pathPublic = path.join(__dirname, '..', 'dist');
  app.register(fastifyStatic, {
    root: pathPublic,
    prefix: '/assets/',
  });
};

export const opts = {
  dotenv: true,
  data: process.env
}

export default async (fastify, opts) => {
  setUpViews(fastify);
  setUpStaticAssets(fastify);
  addRoutes(fastify);
};
