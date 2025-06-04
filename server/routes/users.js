export default (app) => {
  const objectionModels = app.objection.models;

  app
    .get('/users', async (req, reply) => {
        const users = await objectionModels.user.query();
        reply.render('users/index', { users });
        return reply;
    })
    .get('/users/new', (req, reply) => {
      const user = new objectionModels.user();
      reply.render('users/new', { user });
    });
};
