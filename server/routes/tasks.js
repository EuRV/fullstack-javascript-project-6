// import i18next from 'i18next';

export default (app) => {
  app.get('/tasks', { name: 'tasks', preValidation: app.authenticate }, async (req, reply) => {
    const { models } = app.objection;
    const tasks = await models.task.query().withGraphFetched('[status, creator, executor]').orderBy('id', 'desc');
    reply.render('tasks/index', { tasks });
    return reply;
  });
};
