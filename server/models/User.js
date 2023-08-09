// @ts-check

// import * as objectionUnique from 'objection-unique';
// import BaseModel from './BaseModel';
import objection from 'objection';
import encrypt from '../lib/secure.js';

const { Model } = objection;

// const unique = objectionUnique({ fields: ['email'] });

export default class User extends Model {
  static get tableName() {
    return 'users';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        id: { type: 'integer' },
        first_name: { type: 'string', minLength: 1 },
        last_name: { type: 'string', minLength: 1 },
        email: { type: 'string', minLength: 1 },
        password: { type: 'string', minLength: 3 },
      },
    };
  }

  set password(value) {
    this.passwordDigest = encrypt(value);
  }

  verifyPassword(password) {
    return encrypt(password) === this.passwordDigest;
  }
}
