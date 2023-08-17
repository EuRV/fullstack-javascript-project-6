import {
  describe, beforeAll, beforeEach, it, expect, afterAll, afterEach,
} from '@jest/globals';
import fastify from 'fastify';

import init from '../server/plugin.js';
import { getTestData, prepareData, signIn } from './helpers/index.js';

describe('test task stauses CRUD', () => {
  let app;
  let knex;
  let models;
  let cookie;
  let testData;

  beforeAll(async () => {
    app = fastify({
      exposeHeadRoutes: false,
      // logger: { target: 'pino-pretty' },
    });
    await init(app);
    knex = app.objection.knex;
    models = app.objection.models;
  });

  beforeEach(async () => {
    await knex.migrate.latest();
    await prepareData(app, 'users');
    await prepareData(app, 'task_statuses');
    testData = getTestData();
    cookie = await signIn(app, testData.users.existing);
  });

  it('index', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/statuses',
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it('new', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/statuses/new',
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it('create', async () => {
    const params = testData.statuses.new;
    const response = await app.inject({
      method: 'POST',
      url: '/statuses',
      cookies: cookie,
      payload: {
        data: params,
      },
    });

    expect(response.statusCode).toBe(302);
    const status = await models.status.query().findOne({ name: params.name });
    expect(status).toMatchObject(params);
  });

  it('edit', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/statuses/1/edit',
      cookies: cookie,
    });

    expect(response.statusCode).toBe(200);
  });

  it('update', async () => {
    const params = testData.statuses.update;
    const response = await app.inject({
      method: 'PATCH',
      url: '/statuses/1',
      cookies: cookie,
      payload: {
        data: params,
      },
    });

    expect(response.statusCode).toBe(302);
    const status = await models.status.query().findOne({ name: params.name });
    expect(status).toMatchObject(params);
  });

  it('delete', async () => {
    const params = testData.statuses.existing;
    const response = await app.inject({
      method: 'DELETE',
      url: '/statuses/1',
      cookies: cookie,
    });

    expect(response.statusCode).toBe(302);
    const status = await models.status.query().findOne({ name: params.name });
    expect(status).toBeUndefined();
  });

  afterEach(async () => {
    await knex('task_statuses').truncate();
    await knex('users').truncate();
  });

  afterAll(async () => {
    await app.close();
  });
});
