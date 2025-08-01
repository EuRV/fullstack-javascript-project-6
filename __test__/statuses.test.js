import { fastify } from 'fastify';

import init from '../server/plugin.js';
import {
  createRandomStatus, signInUser, truncateTables
} from './helpers/index.js';

describe('Status Routes CRUD operations', () => {
  let app;
  let knex;
  let models;

  beforeAll(async () => {
    app = fastify({
      exposeHeadRoutes: false,
      logger: false // как вариант logger: { transport: { target: 'pino-pretty' } },
    });
    await init(app);
    knex = app.objection.knex;
    models = app.objection.models;
  });

  beforeEach(async () => {
    await knex.migrate.latest();
  });

  describe('POST /statuses - Create Status', () => {
    it('should create a new status', async () => {
      const params = createRandomStatus();
      const authCookie = await signInUser(app);
      const response = await app.inject({
        method: 'POST',
        url: '/statuses',
        payload: {
          data: params,
        },
        cookies: authCookie,
      });

      expect(response.statusCode).toBe(302);

      const status = await models.status.query().findOne({ name: params.name });
      expect(status).toBeDefined();
      expect(status).toMatchObject(params);
    });

    it('should throw validation error for invalid data', async () => {
      const params = { name: '' };
      const authCookie = await signInUser(app);
      const response = await app.inject({
        method: 'POST',
        url: '/statuses',
        payload: {
          data: params,
        },
        cookies: authCookie,
      });

      expect(response.statusCode).toBe(200);

      const statuses = await models.status.query();
      expect(statuses).toEqual([]);
    });
  });

  describe('GET /statuses - List Statuses', () => {
    it('should return empty array when no statuses exist', async () => {
      const wrongResponse = await app.inject({
        method: 'GET',
        url: '/statuses',
      });

      expect(wrongResponse.statusCode).toBe(302);

      const authCookie = await signInUser(app);
      const responseWithAuth = await app.inject({
        method: 'GET',
        url: '/statuses',
        cookies: authCookie,
      });

      expect(responseWithAuth.statusCode).toBe(200);

      const statuses = await models.status.query();
      expect(statuses).toEqual([]);
    });

    it('should return list of statuses', async () => {
      const status1 = await models.status.query().insert(createRandomStatus());
      const status2 = await models.status.query().insert(createRandomStatus());

      const authCookie = await signInUser(app);
      const response = await app.inject({
        method: 'GET',
        url: '/statuses',
        cookies: authCookie,
      });

      expect(response.statusCode).toBe(200);

      const statuses = await models.status.query();

      expect(statuses.length).toBe(2);
      expect(statuses[0].name).toBe(status1.name);
      expect(statuses[1].name).toBe(status2.name);
    });
  });

  describe('PATCH /statuses/:id - Update Status', () => {
    it('should return status by ID', async () => {
      const status = await models.status.query().insert(createRandomStatus());

      const authCookie = await signInUser(app);
      const response = await app.inject({
        method: 'GET',
        url: `/statuses/${status.id}/edit`,
        cookies: authCookie,
      });

      expect(response.statusCode).toBe(200);
    });

    it('should update status name', async () => {
      const currentData = createRandomStatus();
      const updatedData = createRandomStatus();
      const { id } = await models.status.query().insert(currentData);

      const authCookie = await signInUser(app);
      const response = await app.inject({
        method: 'PATCH',
        url: `/statuses/${id}`,
        payload: {
          data: updatedData,
        },
        cookies: authCookie,
      });

      expect(response.statusCode).toBe(302);

      const updatedStatus = await models.status.query().findById(id);
      expect(updatedStatus.name).toBe(updatedData.name);
    });

    it('should throw validation error for invalid data', async () => {
      const currentData = createRandomStatus();
      const updatedData = { name: '' };
      const { id } = await models.status.query().insert(currentData);

      const authCookie = await signInUser(app);
      const response = await app.inject({
        method: 'POST',
        url: '/statuses',
        payload: {
          data: updatedData,
        },
        cookies: authCookie,
      });

      expect(response.statusCode).toBe(200);

      const updatedStatus = await models.status.query().findById(id);
      expect(updatedStatus.name).toBe(currentData.name);
    });
  });

  describe('DELETE /statuses/:id - Delete Status', () => {
    it('should delete status', async () => {
      const status = await models.status.query().insert(createRandomStatus());

      const authCookie = await signInUser(app);
      const response = await app.inject({
        method: 'DELETE',
        url: `/statuses/${status.id}`,
        cookies: authCookie,
      });

      expect(response.statusCode).toBe(302);

      const deletedStatus = await models.status.query().findById(status.id);
      expect(deletedStatus).toBeUndefined();
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
