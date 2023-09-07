// @ts-check

import i18next from 'i18next';

export default (app) => {
  app
    .get('/labels', { name: 'labels', preValidation: app.authenticate }, async (req, reply) => {
      const { models } = app.objection;

      const labels = await models.label.query();
      reply.render('labels/index', { labels });
      return reply;
    })
    .get('/labels/new', { name: 'newLabel', preValidation: app.authenticate }, (req, reply) => {
      const label = new app.objection.models.label();
      reply.render('labels/new', { label });
    })
    .get('/labels/:id/edit', { name: 'editLabel', preValidation: app.authenticate }, async (req, reply) => {
      const { models } = app.objection;
      const { id } = req.params;
      const label = await models.label.query().findById(id);
      reply.render('labels/edit', { label });
      return reply;
    })
    .post('/labels', { name: 'createLabel', preValidation: app.authenticate }, async (req, reply) => {
      const { models } = app.objection;
      const { data } = req.body;

      try {
        const validLabel = await models.label.fromJson({ ...data });
        await models.label.query().insert(validLabel);
        req.flash('info', i18next.t('flash.labels.create.success'));
        reply.redirect('/labels');
      } catch (err) {
        req.flash('error', i18next.t('flash.labels.create.error'));
        reply.render('labels/new', { label: data, errors: err.data });
      }

      return reply;
    })
    .patch('/labels/:id', { name: 'updateLabel', preValidation: app.authenticate }, async (req, reply) => {
      const { models } = app.objection;
      const { data } = req.body;
      const { id } = req.params;
      const label = await models.label.query().findById(id);

      try {
        const validLabel = await models.label.fromJson({ ...data });
        await label.$query().update(validLabel);
        req.flash('info', i18next.t('flash.labels.update.success'));
        reply.redirect('/labels');
      } catch (err) {
        req.flash('error', i18next.t('flash.labels.update.error'));
        reply.render('labels/edit', { label: { id, ...data }, errors: err.data });
      }

      return reply;
    })
    .delete('/labels/:id', { name: 'deleteLabel', preValidation: app.authenticate }, async (req, reply) => {
      const { models } = app.objection;
      const { id } = req.params;

      try {
        await models.label.query().deleteById(id);
        req.flash('info', i18next.t('flash.labels.delete.success'));
      } catch (err) {
        req.flash('error', i18next.t('flash.labels.delete.error'));
      }

      reply.redirect('/labels');
      return reply;
    });
};
