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
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    };
  }

  async $beforeInsert(queryContext) {
    await super.$beforeInsert(queryContext);

    const now = new Date().toISOString();
    this.createdAt = now;
    this.updatedAt = now;
  }

  async $beforeUpdate(opt, queryContext) {
    await super.$beforeUpdate(opt, queryContext);

    const old = queryContext.old;

    const changedFields = Object.keys(this).filter(key =>
      key !== 'updatedAt' &&
      this[key] !== this[key] !== old[key] &&
      key[0] !== '$'
    );

    if (changedFields.length > 0) {
      this.updatedAt = new Date().toISOString();
    }
  }

  static relationMappings = {
    tasks: {
      relation: BaseModel.HasManyRelation,
      modelClass: 'Task.cjs',
      join: {
        from: 'statuses.id',
        to: 'tasks.statusId',
      },
    },
  };

  static modifiers = {
    getShortData(query) {
      query.select(
        'id',
        'name'
      );
    },
  };
};
