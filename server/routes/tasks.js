export default (app) => {
  app
    .get('/tasks', { preValidation: app.authenticate }, async (request, reply) => {
      const tasks = [];
      reply.render('tasks/index', { tasks });
      return reply;
    });
};
