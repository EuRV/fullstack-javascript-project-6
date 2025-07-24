import i18next from 'i18next';

export default (app) => {
  const objectionModels = app.objection.models;

  app
    .get('/tasks', { preValidation: app.authenticate }, async (request, reply) => {
      const tasks = await objectionModels.task
        .query()
        .withGraphJoined('[status(getShortData), executor(getFullName), creator(getFullName)]');

      reply.render('tasks/index', { tasks });
      return reply;
    })
    .get('/tasks/new', { preValidation: app.authenticate }, async (request, reply) => {
      const task = new objectionModels.task();
      const [executors, statuses, labels] = await Promise.all([
        objectionModels.user.query().modify('getFullName'),
        objectionModels.status.query().modify('getShortData'),
        objectionModels.label.query().modify('getShortData')
      ]);

      reply.render('tasks/new', { task, executors, statuses, labels });
      return reply;
    })
    .get('/tasks/:id', { preValidation: app.authenticate }, async (request, reply) => {
      const { id } = request.params;

      const task = await objectionModels.task
        .query()
        .findById(id)
        .withGraphJoined('[status(getShortData), executor(getFullName), creator(getFullName), labels(getShortData)]');

      reply.render('tasks/view', { task });
      return reply;
    })
    .get('/tasks/:id/edit', { preValidation: app.authenticate }, async (request, reply) => {
      const { id } = request.params;
      const task = await objectionModels.task
        .query()
        .findById(id)
        .withGraphJoined('[labels(getShortData)]');
      const [executors, statuses, labels] = await Promise.all([
        objectionModels.user.query().modify('getFullName'),
        objectionModels.status.query().modify('getShortData'),
        objectionModels.label.query().modify('getShortData')
      ]);

      reply.render('tasks/edit', { task, executors, statuses, labels });
      return reply;
    })
    .post('/tasks', { preValidation: app.authenticate }, async (request, reply) => {
      const task = new objectionModels.task();
      const { labels: labelIds = [], ...dataTask } = {
        creatorId: request.session.get('passport').id,
        ...request.body.data,
      };

      try {
        await objectionModels.task.transaction(async (trx) => {
          const existingLabels = await objectionModels.label.query(trx).findByIds([...labelIds])
            .then((labels) => labels.map(({ id }) => ({ id })));

          if ([...labelIds].length !== existingLabels.length) {
            const existingIds = existingLabels.map(l => l.id);
            const missingIds = labelIds.filter(id => !existingIds.includes(id));
            throw new Error(`Labels not found: ${missingIds.join(', ')}`);
          }
          await objectionModels.task.query(trx)
            .upsertGraphAndFetch({ ...dataTask, labels: existingLabels}, {
              relate: true,
              unrelate: true,
              noUpdate: ['labels']
            });
        });
        request.flash('info', i18next.t('flash.tasks.create.success'));
        reply.redirect('/tasks');
      } catch (error) {
        console.error(error)
        request.flash('error', i18next.t('flash.tasks.create.error'));
        const [executors, statuses, labels] = await Promise.all([
          objectionModels.user.query().modify('getFullName'),
          objectionModels.status.query().modify('getShortData'),
          objectionModels.label.query().modify('getShortData')
        ]);
        reply.render('tasks/new', { task, executors, statuses, labels, errors: error.data });
      }
      return reply;
    })
    .patch('/tasks/:id', { preValidation: app.authenticate }, async (request, reply) => {
      const { id } = request.params;
      const task = await objectionModels.task
        .query()
        .findById(id)
        .withGraphJoined('[labels(getShortData)]');

      const { labels: labelIds = [], ...dataTask } = {
        ...request.body.data,
        id,
        creatorId: task.creatorId,
      };

      try {
        await objectionModels.task.transaction(async (trx) => {
          const existingLabels = await objectionModels.label.query(trx).findByIds([...labelIds])
            .then((labels) => labels.map(({ id }) => ({ id })));

          if ([...labelIds].length !== existingLabels.length) {
            const existingIds = existingLabels.map(l => l.id);
            const missingIds = labelIds.filter(id => !existingIds.includes(id));
            throw new Error(`Labels not found: ${missingIds.join(', ')}`);
          }
          await objectionModels.task.query(trx)
            .upsertGraphAndFetch({ ...dataTask, labels: existingLabels}, {
              relate: true,
              unrelate: true,
              noUpdate: ['labels']
            });
        });
        request.flash('info', i18next.t('flash.tasks.update.success'));
        reply.redirect('/tasks');
      } catch (error) {
        console.error(error)
        request.flash('error', i18next.t('flash.tasks.update.error'));
        task.$set({ ...dataTask, labels: [...labelIds].map((id) => ({ id: parseInt(id, 10) })) });
        const [executors, statuses, labels] = await Promise.all([
          objectionModels.user.query().modify('getFullName'),
          objectionModels.status.query().modify('getShortData'),
          objectionModels.label.query().modify('getShortData')
        ]);
        reply.render('tasks/edit', { task, executors, statuses, labels, errors: error.data });
      }
      return reply;
    })
    .delete('/tasks/:id', { preValidation: app.authenticate }, async (request, reply) => {
      const { id } = request.params;
      const currentUserId = parseInt((request.session.get('passport').id), 10);
      const task = await objectionModels.task.query().findById(id);

      if (currentUserId !== task.creatorId) {
        request.flash('error', i18next.t('flash.tasks.delete.errorAccess'));
        reply.redirect('/tasks');
        return reply;
      }

      try {
        await task.$query().delete();
        request.flash('info', i18next.t('flash.tasks.delete.success'));
        reply.redirect('/tasks');
      } catch (error) {
        request.flash('error', i18next.t('flash.tasks.delete.error'));
      }
      return reply;
    });
};
