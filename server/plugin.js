// EARLYBIRDSSQL10

export const opts = {
  dotenv: true,
  data: process.env
}

export default async (fastify, opts) => {
  fastify.get('/', async (request, reply) => {
    return { hello: 'world' };
  })
};
