export default (app) => {
  app
    .get('/', { name: 'root' }, (req, reply) => {
      reply.view('welcome/index');
    });
};