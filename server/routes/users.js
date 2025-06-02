export default (app) => {
  const objectionModels = app.objection.models;

  app
    .get('/users', (req, reply) => {
      const users = [];
      reply.render('users/index', { users });
    })
    .get('/users/new', (req, reply) => {
      const user = new objectionModels.user();
      reply.render('users/new', { user });
    });
};
