import { withTransaction } from './helpers.js';

export const UserService = (app) => {
  const { knex } = app.objection;
  const { user: UserModel } = app.objection.models;

  const createUserModel = () => new UserModel();

  const findAll = async (options = {}) => {
    return await UserModel.query().modify('getPublicDate');
  };

  const create = async (data) => {
    return withTransaction(knex, async (trx) => {
      return await UserModel.query(trx).insert(data);
    });
  };

  return { createUserModel, findAll, create };
};
