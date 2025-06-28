export default (app) => {
  app
    .get('/tasks', { preValidation: app.authenticate }, async (request, reply) => {
      const tasks = [];
      reply.render('tasks/index', { tasks });
      return reply;
    })
    .get('/tasks/new', { preValidation: app.authenticate }, async (request, reply) => {
      const task = {};
      const executors = [];
      const statuses = [];
      reply.render('tasks/new', { task, executors, statuses });
      return reply;
    });
};
