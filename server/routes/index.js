export default (app) => {
  app
    .get('/', async (req, reply) => {
        return reply.view('index.pug');
    });
};