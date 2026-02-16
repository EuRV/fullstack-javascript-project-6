import i18next from 'i18next';
import { ROUTES, VIEWS, FLASH_TYPES, FLASH_MESSAGES } from './config.js';

export default (app) => {
  app
    .get(ROUTES.NEW, (request, reply) => {
      const signInForm = {};
      reply.render(VIEWS.NEW, { signInForm });
    })
    .post(ROUTES.CREATE, app.fp.authenticate('form', async (request, reply, err, user) => {
      if (err) {
        return app.httpErrors.internalServerError(err);
      }
      if (!user) {
        const signInForm = request.body.data;
        const errors = {
          email: [{
            message: 'Неверная почта или пароль',
          }],
        };
        reply.render(VIEWS.NEW, { signInForm, errors });
        return reply;
      }
      await request.logIn(user);
      request.flash(FLASH_TYPES.SUCCESS, i18next.t(FLASH_MESSAGES.CREATE_SUCCESS));
      reply.redirect(ROUTES.HOME);
      return reply;
    }))
    .delete(ROUTES.DELETE, (request, reply) => {
      request.logOut();
      request.flash(FLASH_TYPES.INFO, i18next.t(FLASH_MESSAGES.DELETE_SUCCESS));
      reply.redirect(ROUTES.HOME);
    });
};
