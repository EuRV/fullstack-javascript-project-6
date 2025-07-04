import _ from 'lodash';
import { fastify } from 'fastify';

import init from '../server/plugin.js';
import hashPassword from '../server/lib/secure.cjs';
import {
  getTestData, prepareUsersData, signInUser, truncateTables
} from './helpers/index.js';

describe('User Routes CRUD operations', () => {
  let app;
  let knex;
  let models;
  const testData = getTestData();

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
    await prepareUsersData(app);
  });

  describe('POST /users - Create User', () => {
    it('should create a new user', async () => {
      const params = testData.users.new;
      const response = await app.inject({
        method: 'POST',
        url: '/users',
        payload: {
          data: params,
        },
      });

      expect(response.statusCode).toBe(302);

      const expected = {
        ..._.omit(params, 'password'),
        passwordDigest: hashPassword(params.password),
      };
      const user = await models.user.query().findOne({ email: params.email });
      expect(user).toMatchObject(expected);
    });
  });

  describe('PATCH /users/:id - Update User', () => {
    it('update', async () => {
      const id = 1;
      const params = testData.update;
      const requestBody = {
        method: 'PATCH',
        url: `/users/${id}`,
        payload: {
          data: params,
        },
      };
      const userBefore = await models.user.query().findById(id);
      const responseNoAuth = await app.inject(requestBody);
      expect(responseNoAuth.statusCode).toBe(302);

      const authCookie = await signInUser(app);
      const responseWithAuth = await app.inject({
        ...requestBody,
        cookies: authCookie,
      });

      expect(responseWithAuth.statusCode).toBe(302);
      const expected = {
        ..._.omit(params, 'password'),
        passwordDigest: hashPassword(params.password),
      };
      const userAfter = await models.user.query().findById(1);
      expect({ ...userBefore, ...expected }).toMatchObject(userAfter);
    });
  });

  describe('DELETE /useers/:id - Delete User', () => {
    it('delete', async () => {
      const id = 2;
      const authCookie = await signInUser(app);
      const requestBody = {
        method: 'DELETE',
        url: `/users/${id}`,
      };
      const responseNoAuth = await app.inject(requestBody);

      expect(responseNoAuth.statusCode).toBe(302);
      const responseWithAuth = await app.inject({
        ...requestBody,
        cookies: authCookie,
      });
      expect(responseWithAuth.statusCode).toBe(302);
      const deletedUser = await models.user.query().findById(id);
      expect(deletedUser).toBeUndefined();
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
