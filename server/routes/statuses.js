export default (app) => {
  app.get('/statuses', { name: 'statuses' }, async (req, reply) => {
    try {
      const statuses = await app.objection.models.status.query();
      reply.render('statuses/index', { statuses });
    } catch (err) {
      console.error(err);
    }

    return reply;
  });
};
