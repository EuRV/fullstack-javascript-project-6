export default (app) => {
  app
    .get('/users', { name: 'users' }, (req, reply) => {
      reply.view('users/index');
    });
};