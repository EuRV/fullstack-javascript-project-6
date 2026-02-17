import { ROUTES  } from './config.js';
import sessionHandlers from './handlers.js'

export default (app) => {
  const handlers = sessionHandlers(app);

  app
    .get(ROUTES.NEW, handlers.showLoginForm)
    .post(ROUTES.CREATE, app.fp.authenticate('form', handlers.createSession))
    .delete(ROUTES.DELETE, handlers.deleteSession);
};
