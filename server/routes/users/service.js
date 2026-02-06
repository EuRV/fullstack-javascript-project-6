export const UserService = (app) => {
  const { user: UserModel } = app.objection.models;

  const findAll = async (options = {}) => {
    const users = await UserModel.query().modify('getPublicDate');
    console.log(users)
    return users;
  };

  return { findAll };
};
