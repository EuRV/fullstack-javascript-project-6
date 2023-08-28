// import i18next from 'i18next';

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

      reply.render('tasks/new', {
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

      try {
        const validTask = await models.task.fromJson({ ...parsedData });
        await models.task.query().insert(validTask);
        reply.redirect('/tasks');
      } catch (err) {
        console.error('error', err);
      }

      return reply;
    });
};
