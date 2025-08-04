import { fastify } from 'fastify';

import init from '../server/plugin.js';
import {
  createRandomName as createRandomLabel, signInUser, truncateTables
} from './helpers/index.js';

describe('Label Routes CRUD operations', () => {
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

  describe('POST /labels - Create Label', () => {
    it('should render new label form', async () => {
      const authCookie = await signInUser(app);
      const response = await app.inject({
        method: 'GET',
        url: '/labels/new',
        cookies: authCookie,
      });

      expect(response.statusCode).toBe(200);
      expect(response.payload).toMatch('Создание метки');
    });

    it('should create a new label', async () => {
      const params = createRandomLabel();
      const authCookie = await signInUser(app);
      const response = await app.inject({
        method: 'POST',
        url: '/labels',
        payload: {
          data: params,
        },
        cookies: authCookie,
      });

      expect(response.statusCode).toBe(302);

      const label = await models.label.query().findOne({ name: params.name });
      expect(label).toBeDefined();
      expect(label).toMatchObject(params);
    });

    it('should throw validation error for invalid data', async () => {
      const params = { name: '' };
      const authCookie = await signInUser(app);
      const response = await app.inject({
        method: 'POST',
        url: '/labels',
        payload: {
          data: params,
        },
        cookies: authCookie,
      });

      expect(response.statusCode).toBe(200);

      const labels = await models.label.query();
      expect(labels).toEqual([]);
    });
  });

  describe('GET /labels - List Labels', () => {
    it('should return empty array when no labels exist', async () => {
      const wrongResponse = await app.inject({
        method: 'GET',
        url: '/labels',
      });

      expect(wrongResponse.statusCode).toBe(302);

      const authCookie = await signInUser(app);
      const responseWithAuth = await app.inject({
        method: 'GET',
        url: '/labels',
        cookies: authCookie,
      });

      expect(responseWithAuth.statusCode).toBe(200);

      const labels = await models.label.query();
      expect(labels).toEqual([]);
    });

    it('should return list of labels', async () => {
      const label1 = await models.label.query().insert(createRandomLabel());
      const label2 = await models.label.query().insert(createRandomLabel());

      const authCookie = await signInUser(app);
      const response = await app.inject({
        method: 'GET',
        url: '/labels',
        cookies: authCookie,
      });

      expect(response.statusCode).toBe(200);

      const labels = await models.label.query();

      expect(labels.length).toBe(2);
      expect(labels[0].name).toBe(label1.name);
      expect(labels[1].name).toBe(label2.name);
    });
  });

  describe('PATCH /labels/:id - Update Label', () => {
    it('should return label by ID', async () => {
      const label = await models.label.query().insert(createRandomLabel());

      const authCookie = await signInUser(app);
      const response = await app.inject({
        method: 'GET',
        url: `/labels/${label.id}/edit`,
        cookies: authCookie,
      });

      expect(response.statusCode).toBe(200);
      expect(response.payload).toMatch('Изменение метки');
      expect(response.payload).toMatch(label.name);
    });

    it('should update label name', async () => {
      const currentData = createRandomLabel();
      const updatedData = createRandomLabel();
      const { id } = await models.label.query().insert(currentData);

      const authCookie = await signInUser(app);
      const response = await app.inject({
        method: 'PATCH',
        url: `/labels/${id}`,
        payload: {
          data: updatedData,
        },
        cookies: authCookie,
      });

      expect(response.statusCode).toBe(302);

      const updatedLabel = await models.label.query().findById(id);
      expect(updatedLabel.name).toBe(updatedData.name);
    });

    it('should throw validation error for invalid data', async () => {
      const currentData = createRandomLabel();
      const updatedData = { name: '' };
      const { id } = await models.label.query().insert(currentData);

      const authCookie = await signInUser(app);
      const response = await app.inject({
        method: 'PATCH',
        url: `/labels/${id}`,
        payload: {
          data: updatedData,
        },
        cookies: authCookie,
      });

      expect(response.statusCode).toBe(200);
      expect(response.payload).toMatch('Не удалось обновить метку');

      const updatedLabel = await models.label.query().findById(id);
      expect(updatedLabel.name).toBe(currentData.name);
    });
  });

  describe('DELETE /labels/:id - Delete Label', () => {
    it('should delete label', async () => {
      const label = await models.label.query().insert(createRandomLabel());

      const authCookie = await signInUser(app);
      const response = await app.inject({
        method: 'DELETE',
        url: `/labels/${label.id}`,
        cookies: authCookie,
      });

      expect(response.statusCode).toBe(302);

      const deletedLabel = await models.label.query().findById(label.id);
      expect(deletedLabel).toBeUndefined();
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
