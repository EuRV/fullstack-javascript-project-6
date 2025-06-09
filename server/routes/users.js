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
    })
    .get('/users/:id/edit', async (req, reply) => {
      const [user] = await objectionModels.user.query().where('id', req.params.id);
      reply.render('users/edit', { user });
      return reply;
    })
    .post('/users', async (req, reply) => {
      const user = new objectionModels.user();
      user.$set(req.body.data);

      try {
        const validUser = await objectionModels.user.fromJson(req.body.data);
        await objectionModels.user.query().insert(validUser);
        reply.redirect('/');
      } catch ({ data }) {
        reply.render('users/new', { user, errors: data });
      }

      return reply;
    });
};
