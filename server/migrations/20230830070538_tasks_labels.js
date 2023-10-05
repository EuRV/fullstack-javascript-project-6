// @ts-check

export const up = (knex) => (
  knex.schema.createTable('tasks_labels', (table) => {
    table.integer('task_id');
    table.integer('label_id');
    
    table.foreign('task_id').references('id').inTable('tasks').onDelete('CASCADE');
    table.foreign('label_id').references('id').inTable('labels').onDelete('RESTRICT');
  })
);

export const down = (knex) => knex.schema.dropTable('tasks_labels');
