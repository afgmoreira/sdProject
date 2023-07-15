exports.up = function (knex) {
    return knex.schema.createTable('countries', function (table) {
      table.string('id').primary();
      table.string('country');
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('countries');
  };
  