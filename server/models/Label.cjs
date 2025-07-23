const BaseModel = require('./BaseModel.cjs');

module.exports = class Label extends BaseModel {
  static get tableName() {
    return 'labels';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1 },
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
      key !== 'updatedAt' &&
      this[key] !== old[key] &&
      key[0] !== '$'
    );

    if (changedFields.length > 0) {
      this.updatedAt = new Date().toISOString();
    }
  }

  static get relationMappings() {
    return {
      tasks: {
        relation: BaseModel.ManyToManyRelation,
        modelClass: 'Task.cjs',
        join: {
          from: 'labels.id',
          through: {
            from: 'tasks_labels.labelId',
            to: 'tasks_labels.taskId',
          },
          to: 'tasks.id',
        },
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
  };
};