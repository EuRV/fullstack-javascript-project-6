const objectionUnique = require('objection-unique');

const BaseModel = require('./BaseModel.cjs');

const unique = objectionUnique({ fields: ['name'] });

module.exports = class Status extends unique(BaseModel) {
  static get tableName() {
    return 'statuses';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1, maxLength: 50 },
      },
    };
  }

  static modifiers = {
    getShortData(query) {
      query.select(
        'id',
        'name'
      );
    },
  }
};
