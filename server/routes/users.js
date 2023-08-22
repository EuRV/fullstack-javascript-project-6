import i18next from 'i18next';

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
        req.flash('error', i18next.t('flash.users.authorizationError'));
        return reply.redirect('/users');
      }

      const user = await app.objection.models.user.query().findById(req.params.id);
      reply.render('users/edit', { user });
      return reply;
    })
    .post('/users', async (req, reply) => {
      const user = new app.objection.models.user();
      user.$set(req.body.data);

      try {
        const validUser = await app.objection.models.user.fromJson(req.body.data);
        await app.objection.models.user.query().insert(validUser);
        req.flash('info', i18next.t('flash.users.create.success'));
        reply.redirect('/');
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.users.create.error'));
        reply.render('users/new', { user, errors: data });
      }

      return reply;
    })
    .patch('/users/:id', async (req, reply) => {
      const userId = Number(req.params.id);
      const user = await app.objection.models.user.query().findById(userId);

      try {
        const validUser = await app.objection.models.user.fromJson(req.body.data);
        await user.$query().update(validUser);
        req.flash('info', i18next.t('flash.users.update.success'));
        reply.redirect('/users');
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.users.update.error'));
        reply.render('users/edit', { user, errors: data });
      }

      return reply;
    })
    .delete('/users/:id', { name: 'deleteUser', preValidation: app.authenticate }, async (req, reply) => {
      const userId = Number(req.params.id);
      const currentUser = req.user;

      if (userId !== currentUser.id) {
        req.flash('error', i18next.t('flash.users.authorizationError'));
        return reply.redirect('/users');
      }

      try {
        await app.objection.models.user.query().deleteById(userId);
        req.logOut();
        req.flash('info', i18next.t('flash.users.delete.success'));
      } catch (err) {
        req.flash('error', i18next.t('flash.users.delete.error'));
      }

      reply.redirect('/users');
      return reply;
    });
};
