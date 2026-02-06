import i18next from 'i18next';
import { ROUTES, VIEWS } from './config.js';

export default (app) => {
  const objectionModels = app.objection.models;

  app
    .get(ROUTES.INDEX, async (request, reply) => {
      const users = await objectionModels.user.query().modify('getPublicDate');
      reply.render(VIEWS.INDEX, { users });
      return reply;
    })
    .get(ROUTES.NEW, (request, reply) => {
      const user = new objectionModels.user();
      reply.render(VIEWS.NEW, { user });
    })
    .get(ROUTES.EDIT, { preValidation: app.authenticate, preHandler: app.requireCurrentUser }, async (request, reply) => {
      const { id } = request.params;
      const user = await objectionModels.user.query().findById(id);
      reply.render(VIEWS.EDIT, { user });
      return reply;
    })
    .post(ROUTES.CREATE, async (request, reply) => {
      try {
        await objectionModels.user.query().insert(request.body.data);
        request.flash('info', i18next.t('flash.users.create.success'));
        reply.redirect(ROUTES.HOME);
      } catch ({ data }) {
        request.flash('error', i18next.t('flash.users.create.error'));
        reply.render(VIEWS.NEW, { user: request.body.data, errors: data });
      }

      return reply;
    })
    .patch(ROUTES.UPDATE, async (request, reply) => {
      const { id } = request.params;
      const user = await objectionModels.user.query().findOne({ id });
      try {
        await user.$query().patch(request.body.data);
        request.flash('info', i18next.t('flash.users.update.success'));
        reply.redirect(ROUTES.INDEX);
      } catch ({ data }) {
        request.flash('error', i18next.t('flash.users.update.error'));
        reply.render(VIEWS.EDIT, { user, errors: data });
      }
      return reply;
    })
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
