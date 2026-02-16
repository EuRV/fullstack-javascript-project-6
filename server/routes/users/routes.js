import { UserHandler } from './handlers.js'
import { ROUTES } from './config.js';

export default (app) => {
  const handler = UserHandler(app);
  const objectionModels = app.objection.models;

  app
    .get(ROUTES.INDEX, handler.index)
    .get(ROUTES.NEW, handler.newUser)
    .get(ROUTES.EDIT, {
      preValidation: app.authenticate,
      preHandler: app.requireCurrentUser,
    }, handler.editUser)
    .post(ROUTES.CREATE, handler.createUser)
    .patch(ROUTES.UPDATE, {
      preValidation: app.authenticate,
      preHandler: app.requireCurrentUser,
    }, handler.updateUser)
    .delete(ROUTES.DELETE, {
      preValidation: app.authenticate,
      preHandler: app.requireCurrentUser,
    }, handler.deleteUser);
};
