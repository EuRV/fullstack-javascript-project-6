export default (app) => {
  const objectionModels = app.objection.models;

  app
    .get('/tasks', { preValidation: app.authenticate }, async (request, reply) => {
      const tasks = [];
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
    });
};
