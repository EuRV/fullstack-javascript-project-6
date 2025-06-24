// import i18next from 'i18next';

export default (app) => {
  app
    .get('/statuses', { preValidation: app.authenticate }, async (request, reply) => {
      const statuses = [];
      reply.render('statuses/index', { statuses });
      return reply;
    });
};
