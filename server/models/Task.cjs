const BaseModel = require('./BaseModel.cjs');

module.exports = class Task extends BaseModel {
  static get tableName() {
    return 'tasks';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'statusId', 'creatorId'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1 },
        description: { type: 'string' },
        statusId: { type: 'integer', minimum: 1 },
        creatorId: { type: 'integer', minimum: 1 },
        executorId: { type: ['integer', 'null'] },
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

    const { old } = opt;

    const changedFields = Object.keys(this).filter(key =>
      key !== 'updated_at' &&
      this[key] !== old[key] &&
      key[0] !== '$'
    );

    if (changedFields.length > 0) {
      this.updated_at = new Date().toISOString();
    }
  }

  $parseJson(json, opt) {
    json = super.$parseJson(json, opt);

    const converted = {
      ...json,
      statusId: parseInt(json.statusId, 10),
      creatorId: parseInt(json.creatorId, 10),
      executorId: parseInt(json.executorId, 10) || null,
    };

    return converted;
  }

  static relationMappings = {
    creator: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: 'User.cjs',
      join: {
        from: 'tasks.creatorId',
        to: 'users.id',
      },
    },
    executor: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: 'User.cjs',
      join: {
        from: 'tasks.executorId',
        to: 'users.id',
      },
    },
    status: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: 'Status.cjs',
      join: {
        from: 'tasks.statusId',
        to: 'statuses.id',
      },
    },
  };
};
