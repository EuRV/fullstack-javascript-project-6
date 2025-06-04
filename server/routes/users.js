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
