import i18next from 'i18next';

export default (app) => {
  app
    .get('/statuses', { name: 'statuses', preValidation: app.authenticate }, async (req, reply) => {
      const statuses = await app.objection.models.status.query();
      reply.render('statuses/index', { statuses });
      return reply;
    })
    .get('/statuses/new', { name: 'newStatus', preValidation: app.authenticate }, (req, reply) => {
      const status = new app.objection.models.status();
      reply.render('statuses/new', { status });
    })
    .get('/statuses/:id/edit', { name: 'editStatus', preValidation: app.authenticate }, async (req, reply) => {
      const { models } = app.objection;
      const { id } = req.params;
      const status = await models.status.query().findById(id);
      reply.render('statuses/edit', { status });
      return reply;
    })
    .post('/statuses', async (req, reply) => {
      const status = new app.objection.models.status();
      status.$set(req.body.data);

      try {
        const validStatus = await app.objection.models.status.fromJson(req.body.data);
        await app.objection.models.status.query().insert(validStatus);
        req.flash('info', i18next.t('flash.statuses.create.success'));
        reply.redirect('/statuses');
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.statuses.create.error'));
        reply.render('statuses/new', { status, errors: data });
      }

      return reply;
    })
    .patch('/statuses/:id', async (req, reply) => {
      const { id } = req.params;
      const { data } = req.body;
      const { models } = app.objection;
      const status = await app.objection.models.status.query().findById(id);

      try {
        const validStatus = await models.status.fromJson(data);
        await status.$query().update(validStatus);
        req.flash('info', i18next.t('flash.statuses.update.success'));
        reply.redirect('/statuses');
      } catch (err) {
        req.flash('error', i18next.t('flash.statuses.update.error'));
        reply.render('statuses/edit', { status: { id, ...data }, errors: err.data });
      }

      return reply;
    })
    .delete('/statuses/:id', { name: 'deleteStatus', preValidation: app.authenticate }, async (req, reply) => {
      const { models } = app.objection;
      const { id } = req.params;

      try {
        await models.status.query().deleteById(id);
        req.flash('info', i18next.t('flash.statuses.delete.success'));
      } catch (err) {
        req.flash('error', i18next.t('flash.statuses.delete.error'));
      }

      reply.redirect('/statuses');
      return reply;
    });
};
