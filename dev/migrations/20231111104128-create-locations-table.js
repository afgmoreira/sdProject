exports.up = function (knex) {
    return knex.schema.createTable('locations', function (table) {
      table.string('id').primary();
      table.string('location');
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('locations');
  };
  