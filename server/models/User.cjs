const objectionUnique = require('objection-unique');

const BaseModel = require('./BaseModel.cjs');
const hashPassword = require('../lib/secure.cjs');

const unique = objectionUnique({ fields: ['email'] });

module.exports = class User extends unique(BaseModel) {
  static get tableName() {
    return 'users';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['firstName', 'lastName', 'email', 'password'],
      properties: {
        id: { type: 'integer' },
        firstName: { type: 'string', minLength: 1 },
        lastName: { type: 'string', minLength: 1 },
        email: { type: 'string', minLength: 1 },
        password: { type: 'string', minLength: 3 },
      },
    };
  }

  static modifiers = {
    getFullName(query) {
      const { raw } = User;
      query.select(
        'id',
        raw("CONCAT(??, ' ', ??)", ['firstName', 'lastName']).as('fullName')
      );
    },

    getPublicDate(query) {
      const { raw } = User;
      query.select(
        'id',
        raw("CONCAT(??, ' ', ??)", ['firstName', 'lastName']).as('fullName'),
        'email',
        'createdAt'
      );
    },
  }

  set password(value) {
    this.passwordDigest = hashPassword(value);
  }

  verifyPassword(password) {
    return hashPassword(password) === this.passwordDigest;
  }
};
