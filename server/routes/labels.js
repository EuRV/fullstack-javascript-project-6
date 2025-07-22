import i18next from 'i18next';

export default (app) => {
  const objectionModels = app.objection.models;

  app
    .get('/labels', { preValidation: app.authenticate }, async (request, reply) => {
      const labels = await objectionModels.label.query();
      reply.render('labels/index', { labels });
      return reply;
    },
    );
};