// @ts-check

// import i18next from 'i18next';

export default (app) => {
  app
    .get('/labels', { name: 'labels', preValidation: app.authenticate }, async (req, reply) => {
      const { models } = app.objection;

      const labels = await models.label.query();
      reply.render('labels/index', { labels });
      return reply;
    });
};
