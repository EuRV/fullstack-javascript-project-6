import * as ROUTES from './config.js';
import { UserService } from './service.js';
import * as HELPERS from './helpers.js';
import { FLASH_MESSAGES, VIEWS } from './config.js';

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

  return { index };
};
