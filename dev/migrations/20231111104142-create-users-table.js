exports.up = function (knex) {
    return knex.schema.createTable('users', function (table) {
      table.string('user_id').primary();
      table.string('username');
      table.string('password');
      table.string('role');
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('users');
  };
  