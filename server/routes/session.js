export default (app) => {
  app
    .get('/session/new', (request, reply) => {
      const signInForm = {};
      reply.render('session/new', { signInForm });
    })
    .post('/session', app.fp.authenticate('form', async (request, reply, err, user) => {
      if (err) {
        return app.httpErrors.internalServerError(err);
      }
      if (!user) {
        const signInForm = request.body.data;
        const errors = {
          email: [{
            message: 'Неверная почта или пароль',
          }],
        };
        reply.render('session/new', { signInForm, errors });
        return reply;
      }
      await request.logIn(user);
      reply.redirect('/');
      return reply;
    }))
    .delete('/session', (request, reply) => {
      request.logOut();
      reply.redirect('/');
    });
};
