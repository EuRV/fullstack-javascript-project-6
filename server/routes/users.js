export default (app) => {
  app
    // eslint-disable-next-line consistent-return
    .get('/users', { name: 'users' }, async (req, reply) => {
      try {
        const users = await app.objection.models.user.query();
        reply.render('users/index', { users });
        return reply;
      } catch (err) {
        console.error(err);
      }
    })
    .get('/users/new', { name: 'newUser' }, (req, reply) => {
      const user = new app.objection.models.user();
      reply.render('users/new', { user });
    })
    .get('/users/:id/edit', { name: 'editUser', preValidation: app.authenticate }, async (req, reply) => {
      const userId = Number(req.params.id);
      const { id } = req.user;

      if (userId !== id) {
        return reply.redirect('/users');
      }

      const user = await app.objection.models.user.query().findById(req.params.id);
      reply.render('users/edit', { user });
      return reply;
    })
    // eslint-disable-next-line consistent-return
    .post('/users', async (req, reply) => {
      const user = new app.objection.models.user();
      user.$set(req.body.data);

      try {
        const validUser = await app.objection.models.user.fromJson(req.body.data);
        await app.objection.models.user.query().insert(validUser);
        reply.redirect('/');
        return reply;
      } catch ({ data }) {
        console.error(data);
      }
    })
    .patch('/users/:id', async (req, reply) => {
      const userId = Number(req.params.id);
      const user = await app.objection.models.user.query().findById(userId);

      try {
        const validUser = await app.objection.models.user.fromJson(req.body.data);
        await user.$query().update(validUser);
        return reply.redirect('/users');
      } catch ({ data }) {
        // console.warn(data);
        return reply.render('users/edit', { user });
      }
    })
    .delete('/users/:id', { name: 'deleteUser', preValidation: app.authenticate }, async (req, reply) => {
      const userId = Number(req.params.id);
      const currentUser = req.user;

      if (userId !== currentUser.id) {
        return reply.redirect('/users');
      }

      try {
        await app.objection.models.user.query().deleteById(userId);
        req.logOut();
        return reply.redirect('/users');
      } catch (err) {
        console.error(err);
        return reply.redirect('/users');
      }
    });
};
