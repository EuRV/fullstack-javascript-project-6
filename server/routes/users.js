export default (app) => {
  app
    .get('/users', { name: 'users' }, async (req, reply) => {
      try {
        const users = await app.objection.models.user.query();
        reply.view('users/index', { users });
        return reply;
      } catch (err) {
        console.error(err);
      }
    })
    .get('/users/new', { name: 'newUser' }, (req, reply) => {
      const user = new app.objection.models.user();
      reply.view('users/new', { user });
    })
    .post('/users', async (req, reply) => {
      const user = new app.objection.models.user();
      user.$set(req.body.data);

      try {
        const validUser = await app.objection.models.user.fromJson(req.body.data);
        console.log(validUser);
        await app.objection.models.user.query().insert(validUser);
      } catch({ data }) {
        console.error(data);
      }
    });
};