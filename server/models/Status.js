// @ts-check

import objectionUnique from 'objection-unique';
import { Model } from 'objection';

const unique = objectionUnique({ fields: ['name'] });

export default class Status extends unique(Model) {
  static get tableName() {
    return 'task_statuses';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1 },
      },
    };
  }
}
