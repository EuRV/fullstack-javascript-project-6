// EARLYBIRDSSQL10
import { fileURLToPath } from 'url';
import path from 'path';
import fastifyStatic from '@fastify/static';
import fastifyView from '@fastify/view';
import Pug from 'pug';
import i18next from 'i18next';

import ru from './locales/ru.js';
import addRoutes from './routes/index.js';

const __dirname = fileURLToPath(path.dirname(import.meta.url));

const setUpViews = (app) => {
  app.register(fastifyView, {
    engine: {
      pug: Pug,
    },
    includeViewExtension: true,
    defaultContext: {
      t: (key) => i18next.t(key),
      assetPath: (filename) => `/assets/${filename}`,
      formatDate: (str) => {
        const date = new Date(str);
        return date.toLocaleString();
      },
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

export const opts = {
  dotenv: true,
  data: process.env
}

export default async (fastify, opts) => {
  await setupLocalization();
  setUpViews(fastify);
  setUpStaticAssets(fastify);
  addRoutes(fastify);
};
