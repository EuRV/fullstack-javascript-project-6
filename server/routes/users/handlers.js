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

  const editUser = async (request, reply) => {
    const { id } = request.params;
    const user = await service.findById(id);
    reply.render(VIEWS.EDIT, { user });
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

  const updateUser = async (request, reply) => {
    const { id } = request.params;
    const { data: user } = request.body;

    try {
      await service.update(id, user);
      request.flash(FLASH_TYPES.INFO, i18next.t(FLASH_MESSAGES.UPDATE_SUCCESS));
      reply.redirect(ROUTES.INDEX);
    } catch (error) {
      const errors = error.data || {};
      request.flash(FLASH_TYPES.ERROR, i18next.t(FLASH_MESSAGES.UPDATE_ERROR));
      reply.render(VIEWS.EDIT, { user: { ...user, id }, errors });
    }
    return reply;
  };

  const deleteUser = async (request, reply) => {
    const { id } = request.params;

    try {
      await service.remove(id);
      request.logOut();
      request.flash(FLASH_TYPES.INFO, i18next.t(FLASH_MESSAGES.DELETE_SUCCESS));
      reply.redirect(ROUTES.INDEX);
    } catch (error) {
      request.flash(FLASH_TYPES.ERROR, i18next.t(FLASH_MESSAGES.DELETE_ERROR));
      reply.redirect(ROUTES.INDEX);
    }
    return reply;
  };

  return {
    index,
    newUser,
    createUser,
    editUser,
    updateUser,
    deleteUser,
  };
};
