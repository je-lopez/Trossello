
exports.up = function(knex, Promise) {
  Promise.all([
    knex.schema.createTable('comments', (table) => {
      table.increments('id').primary()
      table.integer('card_id').notNullable()
      table.integer('user_id').notNullable()
      table.string('comment').notNullable()
      table.timestamp('created_at').defaultTo(knex.fn.now())
    })
  ])
};

exports.down = function(knex, Promise) {
  Promise.all([
    knex.schema.dropTable('comments')
  ])
};
