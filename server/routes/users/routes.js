import i18next from 'i18next';
import { UserHandler } from './handlers.js'
import { ROUTES, VIEWS } from './config.js';

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
    .delete(ROUTES.DELETE, { preValidation: app.authenticate, preHandler: app.requireCurrentUser }, async (request, reply) => {
      const { id } = request.params;
      const user = await objectionModels.user.query().findById(id);

      try {
        await user.$query().delete();
        request.logOut();
        request.flash('info', i18next.t('flash.users.delete.success'));
        reply.redirect(ROUTES.INDEX);
      } catch (error) {
        console.error(error);
        request.flash('error', i18next.t('flash.users.delete.error'));
        reply.redirect(ROUTES.INDEX);
      }
      return reply;
    });
};
