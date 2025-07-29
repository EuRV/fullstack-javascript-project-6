import i18next from 'i18next';

export default (app) => {
  const objectionModels = app.objection.models;

  app
    .get('/labels', { preValidation: app.authenticate }, async (request, reply) => {
      const labels = await objectionModels.label.query();
      reply.render('labels/index', { labels });
      return reply;
    })
    .get('/labels/new', { preValidation: app.authenticate }, (request, reply) => {
      const label = new objectionModels.label();
      reply.render('labels/new', { label });
    })
    .get('/labels/:id/edit', { name: 'labelUpdate', preValidation: app.authenticate }, async (request, reply) => {
      const { id } = request.params;
      const label = await objectionModels.label.query().findById(id);
      reply.render('labels/edit', { label });
      return reply;
    })
    .post('/labels', { preValidation: app.authenticate }, async (request, reply) => {
      const label = new objectionModels.label();
      label.$set(request.body.data);

      try {
        await objectionModels.label.query().insert(request.body.data);
        request.flash('info', i18next.t('flash.labels.create.success'));
        reply.redirect('/labels');
      } catch ({ data }) {
        request.flash('error', i18next.t('flash.labels.create.error'));
        reply.render('labels/new', { label, errors: data });
      }
      return reply;
    })
    .patch('/labels/:id', { preValidation: app.authenticate }, async (request, reply) => {
      const { id } = request.params;
      const label = await objectionModels.label.query().findById(id);
      label.$set(request.body.data);

      try {
        await label.$query().patch(request.body.data);
        request.flash('info', i18next.t('flash.labels.update.success'));
        reply.redirect('/labels');
      } catch ({ data }) {
        request.flash('error', i18next.t('flash.labels.update.error'));
        reply.render('labels/edit', { label, errors: data });
      }
      return reply;
    })
    .delete('/labels/:id', { preValidation: app.authenticate }, async (request, reply) => {
      const { id } = request.params;
      const label = await objectionModels.label.query().findById(id);

      try {
        await label.$query().delete();
        request.flash('info', i18next.t('flash.labels.delete.success'));
        reply.redirect('/labels');
      } catch (error) {
        console.error(error);
        request.flash('error', i18next.t('flash.labels.delete.error'));
        reply.redirect('/labels');
      }
      return reply;
    });
};
