export default (app) => {
  const objectionModels = app.objection.models;

  app
    .get('/users', async (request, reply) => {
      const users = await objectionModels.user.query();
      reply.render('users/index', { users });
      return reply;
    })
    .get('/users/new', (request, reply) => {
      const user = new objectionModels.user();
      reply.render('users/new', { user });
    })
    .get('/users/:id/edit', { preValidation: app.authenticate, preHandler: app.requireCurrentUser }, async (request, reply) => {
      const { id } = request.params;
      const user = await objectionModels.user.query().findById(id);
      reply.render('users/edit', { user });
      return reply;
    })
    .post('/users', async (request, reply) => {
      const user = new objectionModels.user();
      user.$set(request.body.data);

      try {
        const validUser = await objectionModels.user.fromJson(request.body.data);
        await objectionModels.user.query().insert(validUser);
        req.flash('info', i18next.t('flash.users.create.success'));
        reply.redirect('/');
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.users.create.error'));
        reply.render('users/new', { user, errors: data });
      }

      return reply;
    })
    .patch('/users/:id', async (request, reply) => {
      const { id } = request.params;
      const user = await objectionModels.user.query().findOne({ id });
      try {
        await user.$query().patch(request.body.data);
        reply.redirect('/users');
      } catch (error) {
        reply.render('users/edit', { user, errors: error });
      }
      return reply;
    })
    .delete('/users/:id', { preValidation: app.authenticate, preHandler: app.requireCurrentUser }, async (request, reply) => {
      const { id } = request.params;
      const user = await objectionModels.user.query().findById(id);

      try {
        request.logOut();
        await user.$query().delete();
        reply.redirect('/users');
      } catch (e) {
        reply.render('', { user, errors: e });
      }
      return reply;
    });
};
