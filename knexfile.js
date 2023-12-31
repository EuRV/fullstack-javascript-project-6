/* eslint-disable linebreak-style */
// @ts-check

import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const migrations = {
  directory: path.join(__dirname, 'server', 'migrations'),
};

export const development = {
  client: 'postgresql',
  connection: {
    host: 'localhost',
    port: process.env.DB_PORT || 5432,
    database: 'testdb',
    user: 'eurv',
    password: 'pgpwd',
  },
  pool: {
    min: 2,
    max: 10,
  },
  useNullAsDefault: true,
  migrations,
};

export const test = {
  client: 'sqlite3',
  connection: ':memory:',
  useNullAsDefault: true,
  // debug: true,
  migrations,
};
