import { fileURLToPath } from 'url';
import path from 'path';
import fastifyStatic from '@fastify/static';
import fastifyView from '@fastify/view';
import Pug from 'pug';
import i18next from 'i18next';

import ru from './locales/ru.js';
import addRoutes from './routes/index.js';
import getHelpers from './helpers/index.js';

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

  app.decorateReply('render', function render(viewPath, locals) {
    this.view(viewPath, { ...locals, reply: this });
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
      fallbackLng: 'ru',
      resources: {
        ru,
      },
    });
};

export default async (app, _opts) => {
  await setupLocalization();
  setUpViews(app);
  setUpStaticAssets(app);
  addRoutes(app);

  return app;
};
