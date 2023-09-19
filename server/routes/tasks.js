import i18next from 'i18next';

export default (app) => {
  app
    .get('/tasks', { name: 'tasks', preValidation: app.authenticate }, async (req, reply) => {
      const { models } = app.objection;
      const tasks = await models.task.query().withGraphFetched('[status, creator, executor]').orderBy('id', 'desc');
      reply.render('tasks/index', { tasks });
      return reply;
    })
    .get('/tasks/new', { name: 'newTask', preValidation: app.authenticate }, async (req, reply) => {
      const { models } = app.objection;
      const task = new app.objection.models.task();
      const statuses = await models.status.query();
      const users = await models.user.query();
      const labels = await models.label.query();

      reply.render('tasks/new', {
        task, statuses, users, labels,
      });
      return reply;
    })
    .get('/tasks/:id', { name: 'viewTask', preValidation: app.authenticate }, async (req, reply) => {
      const { models } = app.objection;
      const { id } = req.params;
      const task = await models.task.query().findById(id).withGraphFetched('[status, creator, executor]');

      reply.render('tasks/view', { task });
      return reply;
    })
    .get('/tasks/:id/edit', { name: 'editTask', preValidation: app.authenticate }, async (req, reply) => {
      const { models } = app.objection;
      const { id } = req.params;
      const task = await models.task.query().findById(id).withGraphFetched('[status, creator, executor]');
      const statuses = await models.status.query();
      const users = await models.user.query();

      reply.render('tasks/edit', {
        task, statuses, users,
      });
      return reply;
    })
    .post('/tasks', { name: 'createTask', preValidation: app.authenticate }, async (req, reply) => {
      const { models } = app.objection;
      const { data } = req.body;

      const parsedData = {
        creatorId: req.user.id,
        statusId: Number(data.statusId),
        executorId: data.executorId ? Number(data.executorId) : null,
        name: data.name.trim(),
        description: data.description?.trim() || null,
      };
      const labelsIds = data.labels ? data.labels.map((id) => ({ id: parseInt(id, 10) })) : null;

      try {
        const validTask = await models.task.fromJson({ ...parsedData });
        console.log({ ...validTask, labelsIds });
        await models.task.transaction(async (trx) => {
          const taskInserted = models.task.query(trx).insertGraph({ ...validTask, labels: labelsIds }, { relate: ['labels'] });
          return taskInserted;
        });
        req.flash('info', i18next.t('flash.tasks.create.success'));
        reply.redirect('/tasks');
      } catch (err) {
        console.log('error', err);
        req.flash('error', i18next.t('flash.tasks.create.error'));
        const statuses = await models.status.query();
        const users = await models.user.query();
        const labels = await models.label.query();
        reply.render('tasks/new', {
          task: data, statuses, users, labels, errors: err.data,
        });
      }

      return reply;
    })
    .patch('/tasks/:id', { name: 'updateTask', preValidation: app.authenticate }, async (req, reply) => {
      const { id } = req.params;
      const { id: creatorId } = req.user;
      const { data } = req.body;
      const { models } = app.objection;
      const task = await models.task.query().findById(id);

      const parsedData = {
        statusId: Number(data.statusId),
        creatorId,
        executorId: data.executorId ? Number(data.executorId) : null,
        name: data.name.trim(),
        description: data.description?.trim() || null,
      };

      try {
        const validTask = await models.task.fromJson({ ...parsedData });
        await task.$query().update(validTask);
        req.flash('info', i18next.t('flash.tasks.update.success'));
        reply.redirect('/tasks');
      } catch (err) {
        req.flash('error', i18next.t('flash.tasks.update.error'));
        const statuses = await models.status.query();
        const users = await models.user.query();
        reply.render('tasks/edit', {
          task: { id, ...data }, statuses, users, errors: err.data,
        });
      }

      return reply;
    })
    .delete('/tasks/:id', { name: 'deleteTask', preValidation: app.authenticate }, async (req, reply) => {
      const { models } = app.objection;
      const { id: taskId } = req.params;
      const { id: userId } = req.user;

      const task = await models.task.query().findById(taskId);

      if (userId !== task.creatorId) {
        req.flash('error', i18next.t('flash.tasks.authorizationError'));
        reply.redirect('/tasks');
        return reply;
      }

      try {
        await models.task.query().deleteById(taskId);
        req.flash('info', i18next.t('flash.tasks.delete.success'));
        reply.redirect('/tasks');
      } catch (err) {
        req.flash('error', i18next.t('flash.tasks.delete.error'));
        reply.redirect('/tasks');
      }

      return reply;
    });
};
