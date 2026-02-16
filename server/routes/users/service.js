import { withTransaction } from './helpers.js';

export const UserService = (app) => {
  const { knex } = app.objection;
  const { user: UserModel } = app.objection.models;

  const createUserModel = () => new UserModel();

  const findAll = async (options = {}) => {
    return await UserModel.query().modify('getPublicDate');
  };

  const findById = async (id, trx = null) => {
    return await UserModel.query(trx).findById(id);
  };

  const create = async (data) => {
    return withTransaction(knex, async (trx) => {
      return await UserModel.query(trx).insert(data);
    });
  };

  const update = async (id, data) => {
    return withTransaction(knex, async (trx) => {
      const user = await findById(id, trx);
      await user.$query(trx).patch(data);
    });
  };

  const remove = async (id) => {
    return withTransaction(knex, async (trx) => {
      const user = await findById(id, trx);
      await user.$query(trx).delete();
    });
  };

  return {
    createUserModel,
    findAll,
    findById,
    create,
    update,
    remove,
  };
};
