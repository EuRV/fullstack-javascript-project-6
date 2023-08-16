// @ts-check

import { URL } from 'url';
import fs from 'fs';
import path from 'path';

const getFixturePath = (filename) => path.join('..', '..', '__fixtures__', filename);
const readFixture = (filename) => fs.readFileSync(new URL(getFixturePath(filename), import.meta.url), 'utf-8').trim();
const getFixtureData = (filename) => JSON.parse(readFixture(filename));

export const getTestData = () => getFixtureData('testData.json');

export const prepareData = async (app, tableName) => {
  const { knex } = app.objection;
  await knex(tableName).insert(getFixtureData(`${tableName}.json`));
};

export const signIn = async (app, data) => {
  const response = await app.inject({
    method: 'POST',
    url: '/session',
    payload: {
      data,
    },
  });

  const [sessionCookie] = response.cookies;
  const { name, value } = sessionCookie;
  const cookie = { [name]: value };
  return cookie;
};
