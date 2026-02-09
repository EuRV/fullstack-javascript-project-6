import i18next from 'i18next';
import { UserService } from './service.js';
import * as HELPERS from './helpers.js';
import { FLASH_MESSAGES, FLASH_TYPES, VIEWS, ROUTES } from './config.js';

export const UserHandler = (app) => {
  const service = UserService(app);
  const { handleError } = HELPERS;

  const index = async (request, reply) => {
    try {
      const users = await service.findAll();
      reply.render(VIEWS.INDEX, { users });
      return reply;
    } catch (error) {
      return handleError(
        request,
        reply,
        FLASH_MESSAGES.COMMON_ERROR,
        ROUTES.HOME
      );
    }
  };

  const newUser = (request, reply) => {
    const user = service.createUserModel();
    reply.render(VIEWS.NEW, { user });
    return reply;
  };

  const createUser = async (request, reply) => {
    const { data: user } = request.body;

    try {
      await service.create(user);
      request.flash(FLASH_TYPES.INFO, i18next.t(FLASH_MESSAGES.CREATE_SUCCESS));
      return reply.redirect(ROUTES.HOME);
    } catch (error) {
      const errors = error.data || {};
      request.flash(FLASH_TYPES.ERROR, i18next.t(FLASH_MESSAGES.CREATE_ERROR));
      return reply.render(VIEWS.NEW, { user, errors });
    }
  };

  return { index, newUser, createUser };
};
