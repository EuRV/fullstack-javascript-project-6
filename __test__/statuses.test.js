import { fastify } from 'fastify';

import init from '../server/plugin.js';

describe('Status Routes CRUD operations', () => {
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
    await prepareUsersData(app);
  });

  // describe('POST /statuses - Create Status', () => {
  //   it('should create a new status', async () => {
  //     const statusData = {
  //       name: faker.word.adjective(),
  //     };

  //     const response = await app.inject({
  //       method: 'POST',
  //       url: '/statuses',
  //       payload: statusData,
  //     });

  //     expect(response.statusCode).toBe(201);
  //     const body = JSON.parse(response.body);

  //     expect(body).toMatchObject({
  //       name: statusData.name,
  //     });

  //     // Проверяем в базе данных
  //     const createdStatus = await Status.query().findById(body.id);
  //     expect(createdStatus).toBeDefined();
  //     expect(createdStatus?.name).toBe(statusData.name);
  //   });

  //   it('should return error for duplicate name', async () => {
  //     const name = faker.word.adjective();
  //     await Status.query().insert({ name });

  //     const response = await app.inject({
  //       method: 'POST',
  //       url: '/statuses',
  //       payload: { name },
  //     });

  //     expect(response.statusCode).toBe(409);
  //     expect(JSON.parse(response.body).message).toContain('already exists');
  //   });

  //   it('should return validation error for empty name', async () => {
  //     const response = await app.inject({
  //       method: 'POST',
  //       url: '/statuses',
  //       payload: { name: '' },
  //     });

  //     expect(response.statusCode).toBe(400);
  //     expect(JSON.parse(response.body).message).toContain('validation failed');
  //   });
  // });

  describe('GET /statuses - List Statuses', () => {
    it('should return empty array when no statuses exist', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/statuses',
      });

      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.body)).toEqual([]);
    });

    it('should return list of statuses', async () => {
      const status1 = await Status.query().insert({
        name: faker.word.adjective()
      });
      const status2 = await Status.query().insert({
        name: faker.word.adjective()
      });

      const response = await app.inject({
        method: 'GET',
        url: '/statuses',
      });

      expect(response.statusCode).toBe(200);
      const statuses = JSON.parse(response.body);

      expect(statuses.length).toBe(2);
      expect(statuses[0].name).toBe(status1.name);
      expect(statuses[1].name).toBe(status2.name);
    });
  });

  // describe('GET /statuses/:id - Get Status by ID', () => {
  //   it('should return status by ID', async () => {
  //     const status = await Status.query().insert({
  //       name: 'Test Status'
  //     });

  //     const response = await app.inject({
  //       method: 'GET',
  //       url: `/statuses/${status.id}`,
  //     });

  //     expect(response.statusCode).toBe(200);
  //     const body = JSON.parse(response.body);

  //     expect(body).toMatchObject({
  //       id: status.id,
  //       name: 'Test Status',
  //     });
  //   });

  //   it('should return 404 for non-existent status', async () => {
  //     const response = await app.inject({
  //       method: 'GET',
  //       url: '/statuses/9999',
  //     });

  //     expect(response.statusCode).toBe(404);
  //     expect(JSON.parse(response.body).message).toContain('not found');
  //   });
  // });

  // describe('PUT /statuses/:id - Update Status', () => {
  //   it('should update status name', async () => {
  //     const status = await Status.query().insert({
  //       name: 'Old Name'
  //     });

  //     const updatedData = {
  //       name: 'New Name',
  //     };

  //     const response = await app.inject({
  //       method: 'PUT',
  //       url: `/statuses/${status.id}`,
  //       payload: updatedData,
  //     });

  //     expect(response.statusCode).toBe(200);
  //     const body = JSON.parse(response.body);

  //     expect(body).toMatchObject(updatedData);

  //     // Проверяем в базе данных
  //     const updatedStatus = await Status.query().findById(status.id);
  //     expect(updatedStatus?.name).toBe('New Name');
  //   });

  //   it('should return error for duplicate name', async () => {
  //     const [status1, status2] = await Status.query().insert([
  //       { name: 'Status 1' },
  //       { name: 'Status 2' },
  //     ]);

  //     const response = await app.inject({
  //       method: 'PUT',
  //       url: `/statuses/${status1.id}`,
  //       payload: {
  //         name: status2.name,
  //       },
  //     });

  //     expect(response.statusCode).toBe(409);
  //     expect(JSON.parse(response.body).message).toContain('already exists');
  //   });

  //   it('should return 404 for non-existent status', async () => {
  //     const response = await app.inject({
  //       method: 'PUT',
  //       url: '/statuses/9999',
  //       payload: {
  //         name: 'Updated',
  //       },
  //     });

  //     expect(response.statusCode).toBe(404);
  //     expect(JSON.parse(response.body).message).toContain('not found');
  //   });
  // });

  // describe('DELETE /statuses/:id - Delete Status', () => {
  //   it('should delete status', async () => {
  //     const status = await Status.query().insert({
  //       name: 'To Delete'
  //     });

  //     const response = await app.inject({
  //       method: 'DELETE',
  //       url: `/statuses/${status.id}`,
  //     });

  //     expect(response.statusCode).toBe(204);

  //     // Проверяем удаление
  //     const deletedStatus = await Status.query().findById(status.id);
  //     expect(deletedStatus).toBeUndefined();
  //   });

  //   it('should return 404 for non-existent status', async () => {
  //     const response = await app.inject({
  //       method: 'DELETE',
  //       url: '/statuses/9999',
  //     });

  //     expect(response.statusCode).toBe(404);
  //     expect(JSON.parse(response.body).message).toContain('not found');
  //   });
  // });
});
