import knex from '../../knex.js';

export default (app) => {
  app
    .get('/users', { name: 'users' }, async (req, reply) => {
      try {
        const users = await knex('users')
          .select({
            id: 'id',
            userName: 'first_name',
            email: 'email',
            createdAt: 'created_at',
          });
        console.log(users);
        reply.view('users/index', { users });
        return reply;
      } catch (err) {
        console.error(err);
      }
    });
};