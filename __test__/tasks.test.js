import { fastify } from 'fastify';

import init from '../server/plugin.js';
import {
  createRandomTask, signInUser, truncateTables, prepareData
} from './helpers/index.js';

describe('Tasks Routes CRUD operations', () => {
  let app;
  let knex;
  let models;

  beforeAll(async () => {
    app = fastify({
      exposeHeadRoutes: false,
      logger: { transport: { target: 'pino-pretty' } },
    });
    await init(app);
    knex = app.objection.knex;
    models = app.objection.models;
  });

  beforeEach(async () => {
    await knex.migrate.latest();
  });

  describe('POST /tasks', () => {
    it('should create new task', async () => {
      const authCookie = await signInUser(app);
      const params = createRandomTask.new();

      const response = await app.inject({
        method: 'POST',
        url: '/tasks',
        payload: {
          data: params,
        },
        cookies: authCookie,
      });

      expect(response.statusCode).toBe(302);
      expect(response.headers.location).toBe('/tasks');

      const task = await models.task.query().first();
      expect(task).toMatchObject(params);
    });

    it('should throw validation error for invalid data', async () => {
      const authCookie = await signInUser(app);
      const params = createRandomTask.invalid();

      const response = await app.inject({
        method: 'POST',
        url: '/tasks',
        payload: {
          data: params,
        },
        cookies: authCookie,
      });

      expect(response.statusCode).toBe(200);
      expect(response.payload).toMatch('Не удалось создать задачу');

      const task = await models.task.query();
      expect(task).toEqual([]);
    });
  });

  describe('GET /tasks', () => {
    it('should return empty array when no tasks exist', async () => {
      const authCookie = await signInUser(app);
      const response = await app.inject({
        method: 'GET',
        url: '/tasks',
        cookies: authCookie,
      });

      expect(response.statusCode).toBe(200);

      const task = await models.task.query();
      expect(task).toEqual([]);
    });

    it('should return tasks list', async () => {
      await prepareData(app);
      const { name } = await models.task.query().first();

      const authCookie = await signInUser(app);
      const response = await app.inject({
        method: 'GET',
        url: '/tasks',
        cookies: authCookie,
      });

      expect(response.statusCode).toBe(200);
      expect(response.payload).toMatch(name);
    });
  });

  afterEach(async () => {
    await truncateTables(knex);
  });

  afterAll(async () => {
    await knex.migrate.rollback();
    await app.close();
  });
});