import i18next from 'i18next';

export default (app) => {
  const objectionModels = app.objection.models;

  app
    .get('/statuses', { preValidation: app.authenticate }, async (request, reply) => {
      const statuses = await objectionModels.status.query();
      reply.render('statuses/index', { statuses });
      return reply;
    })
    .get('/statuses/new', { preValidation: app.authenticate }, async (request, reply) => {
      const status = new objectionModels.status();
      reply.render('statuses/new', { status });
      return reply;
    })
    .get('/statuses/:id/edit', { preValidation: app.authenticate }, async (request, reply) => {
      const { id: statusId } = request.params;
      const status = await objectionModels.status.query().findOne({ statusId });
      reply.render('statuses/edit', { status });
      return reply;
    })
    .post('/statuses', { preValidation: app.authenticate }, async (request, reply) => {
      const status = new objectionModels.status();
      status.$set(request.body.data);

      try {
        const validStatus = await objectionModels.status.fromJson(request.body.data);
        await objectionModels.status.query().insert(validStatus);
        request.flash('info', i18next.t('flash.statuses.create.success'));
        reply.redirect('/statuses');
      } catch ({ data }) {
        request.flash('error', i18next.t('flash.statuses.create.error'));
        reply.render('statuses/new', { status, errors: data });
      }
      return reply;
    })
    .patch('/statuses/:id', { preValidation: app.authenticate }, async (request, reply) => {
      const { id: statusId } = request.params;
      const status = await objectionModels.status.query().findOne({ statusId });

      try {
        const validNewStatus = await objectionModels.status.fromJson(request.body.data);
        await status.$query().patch(validNewStatus);
        request.flash('info', i18next.t('flash.statuses.update.success'));
        reply.redirect('/statuses');
      } catch ({ data }) {
        request.flash('error', i18next.t('flash.statuses.update.error'));
        reply.render('statuses/edit', { status, errors: data });
      }
      return reply;
    })
    .delete('/statuses/:id', { preValidation: app.authenticate }, async (request, reply) => {
      const { id: statusId } = request.params;
      const status = await objectionModels.status.query().findOne({ statusId });

      try {
        await status.$query().delete();
        request.flash('info', i18next.t('flash.statuses.delete.success'));
        reply.redirect('/statuses');
      } catch ({ data }) {
        request.flash('error', i18next.t('flash.statuses.delete.error'));
        reply.render('', { status, errors: data });
      }
      return reply;
    });
};
