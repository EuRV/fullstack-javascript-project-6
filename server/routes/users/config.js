export const ROUTES = {
  INDEX: '/users',
  NEW: '/users/new',
  EDIT: '/users/:id/edit',
  CREATE: '/users',
  UPDATE: '/users/:id',
  DELETE: '/users/:id',
  HOME: '/',
};

export const VIEWS = {
  INDEX: 'users/index',
  NEW: 'users/new',
  EDIT: 'users/edit',
};

export const FLASH_TYPES = {
  INFO: 'info',
  SUCCESS: 'success',
  ERROR: 'error',
};

export const FLASH_MESSAGES = {
  USER_NOT_FOUND: 'flash.users.notFound',
  CREATE_SUCCESS: 'flash.users.create.success',
  CREATE_ERROR: 'flash.users.create.error',
  UPDATE_SUCCESS: 'flash.users.update.success',
  UPDATE_ERROR: 'flash.users.update.error',
  DELETE_SUCCESS: 'flash.users.delete.success',
  DELETE_ERROR: 'flash.users.delete.error',
  COMMON_ERROR: 'flash.common.error',
};
