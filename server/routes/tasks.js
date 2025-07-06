import i18next from 'i18next';

export default (app) => {
  const objectionModels = app.objection.models;

  app
    .get('/tasks', { preValidation: app.authenticate }, async (request, reply) => {
      const tasks = await objectionModels.task
        .query()
        .withGraphJoined('[status, executor(getFullName), creator(getFullName)]');

      reply.render('tasks/index', { tasks });
      return reply;
    })
    .get('/tasks/new', { preValidation: app.authenticate }, async (request, reply) => {
      const task = {};
      const [executors, statuses] = await Promise.all([
        objectionModels.user.query().modify('getFullName'),
        objectionModels.status.query().modify('getShortData')
      ]);

      reply.render('tasks/new', { task, executors, statuses });
      return reply;
    })
    .post('/tasks', { preValidation: app.authenticate }, async (request, reply) => {
      const task = new objectionModels.task();
      const dataTask = {
        ...request.body.data,
        creatorId: request.session.get('passport').id,
      }
      task.$set(dataTask);

      try {
        await objectionModels.task.query().insert(dataTask);
        request.flash('info', i18next.t('flash.tasks.create.success'));
        reply.redirect('/tasks');
      } catch ({ data }) {
        request.flash('error', i18next.t('flash.tasks.create.error'));
        const [executors, statuses] = await Promise.all([
          objectionModels.user.query().modify('getFullName'),
          objectionModels.status.query().modify('getShortData')
        ]);
        reply.render('tasks/new', { task, executors, statuses, errors: data });
      }
      return reply;
    });
};
