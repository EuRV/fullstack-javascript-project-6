import { FLASH_TYPES, FLASH_MESSAGES } from './config.js';

export const handleError = (request, reply, errorKey, redirectTo) => {
  const message = errorKey || FLASH_MESSAGES.COMMON_ERROR;
  request.flash(FLASH_TYPES.ERROR, message);
  
  return reply.redirect(redirectTo);
};

export const withTransaction = async (knex, callback) => {
  const trx = await knex.transaction();
  
  try {
    const result = await callback(trx);
    await trx.commit();
    return result;
  } catch (error) {
    await trx.rollback();
    throw error;
  }
};
