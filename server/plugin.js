// EARLYBIRDSSQL10
import { fileURLToPath } from 'url';
import path from 'path';
import fastifyStatic from '@fastify/static';
import fastifyView from '@fastify/view';
import fastifyFormbody from '@fastify/formbody';
import { plugin as fastifyReverseRoutes } from 'fastify-reverse-routes';
import fastifyObjectionjs from 'fastify-objectionjs';
import qs from 'qs';
import Pug from 'pug';
import i18next from 'i18next';

import ru from './locales/ru.js';
import addRoutes from './routes/index.js';
import getHelpers from './helpers/index.js';
import * as knexConfig from '../knexfile.js';
import models from './models/index.js';

const mode = process.env.NODE_ENV || 'development';
const __dirname = fileURLToPath(path.dirname(import.meta.url));

const setUpViews = (app) => {
  const helpers = getHelpers(app);
  app.register(fastifyView, {
    engine: {
      pug: Pug,
    },
    includeViewExtension: true,
    defaultContext: {
      ...helpers,
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

const setupLocalization = async () => {
  await i18next
    .init({
      lng: 'ru',
      resources: {
        ru,
      },
    });
};

const registerPlugins = async (app) => {
  await app.register(fastifyReverseRoutes);
  await app.register(fastifyFormbody, { parser: qs.parse });
  await app.register(fastifyObjectionjs, {
    knexConfig: knexConfig[mode],
    models,
  });
};

export const opts = {
  dotenv: true,
  data: process.env
}

export default async (fastify, opts) => {
  await registerPlugins(fastify);
  await setupLocalization();
  setUpViews(fastify);
  setUpStaticAssets(fastify);
  addRoutes(fastify);
};
