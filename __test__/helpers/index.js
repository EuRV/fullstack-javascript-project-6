import { URL } from 'url';
import fs from 'fs';
import path from 'path';
import { faker } from '@faker-js/faker';
import passport from '@fastify/passport';

import hashPassword from '../../server/lib/secure.cjs'

const getFixturePath = (filename) => path.join('..', '..', '__fixtures__', filename);
const readFixture = (filename) => fs.readFileSync(new URL(getFixturePath(filename), import.meta.url), 'utf-8').trim();
const getFixtureData = (filename) => JSON.parse(readFixture(filename));

export const getTestData = () => getFixtureData('testData.json');

export const prepareUsersData = async (app) => {
  const { knex } = app.objection;

  await knex('users').insert(getFixtureData('users.json'));
};

export const createRandomStatus = () => ({
  name: faker.word.adjective(),
});

export const createRandomUser = {
  new() {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    }
  },
  update() {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      password: faker.internet.password(),
    }
  },
  prepare() {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      passwordDigest: hashPassword(faker.internet.password()),
    }
  },
};

export const createRandomTask = {
  new() {
    return {
      name: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      statusId: faker.number.int({ min: 1, max: 3 }),
      executorId: faker.number.int({ min: 1, max: 3 }),
    }
  },
  invalid() {
    return {
      name: '',
      description: faker.lorem.paragraph(),
      statusId: faker.number.int({ min: 1, max: 3 }),
      executorId: faker.number.int({ min: 1, max: 3 }),
    }
  },
  prepare() {
    return {
      name: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      statusId: faker.number.int({ min: 1, max: 3 }),
      creatorId: faker.number.int({ min: 1, max: 3 }),
      executorId: faker.number.int({ min: 1, max: 3 }),
    }
  },
};

export const prepareData = async (app) => {
  const { knex } = app.objection;

  await knex('users').insert(getFixtureData('users.json'));
  await knex('statuses').insert(Array.from({length: 3}, createRandomStatus));
  await knex('tasks').insert(Array.from({length: 1}, createRandomTask.prepare));
};

export const signInUser = async (app) => {
  prepareUsersData(app);
  const responseSignIn = await app.inject({
    method: 'POST',
    url: '/session',
    payload: {
      data: getTestData().users.existing,
    },
  });

  const [sessionCookie] = responseSignIn.cookies;
  const { name, value } = sessionCookie;

  return { [name]: value };
};

export const truncateTables = async (knex) => {
  await Promise.all([
    knex('users').truncate(),
    knex('statuses').truncate(),
    knex('tasks').truncate()
  ]);
};
