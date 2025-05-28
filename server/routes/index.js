export default (app) => {
  app
    .get('/', (req, reply) => {
      reply.render('welcome/index');
    })
    .get('/users', (req, reply) => {
      reply.render('welcome/index');
    })
    .get('/session/new', (req, reply) => {
      reply.render('welcome/index');
    })
    .get('/users/new', (req, reply) => {
      reply.render('welcome/index');
    });
};
