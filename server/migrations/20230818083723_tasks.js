// @ts-check

export const up = (knex) => (
  knex.schema.createTable('tasks', (table) => {
    table.increments('id').primary();
    table.integer('status_id');
    table.integer('creator_id');
    table.integer('executor_id');
    table.string('name');
    table.text('description');
    table.timestamps(true, true);
    
    table.foreign('status_id').references('id').inTable('task_statuses').onDelete('RESTRICT');
    table.foreign('creator_id').references('id').inTable('users').onDelete('RESTRICT');
    table.foreign('executor_id').references('id').inTable('users').onDelete('RESTRICT');
  })
);

export const down = (knex) => knex.schema.dropTable('tasks');
