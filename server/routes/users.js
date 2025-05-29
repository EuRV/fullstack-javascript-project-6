export default (app) => {
  app
    .get('/users', (req, reply) => {
      reply.render('welcome/index');
    })
    .get('/users/new', (req, reply) => {
      reply.render('welcome/index');
    });
};
