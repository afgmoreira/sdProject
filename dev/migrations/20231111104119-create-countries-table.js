exports.up = function (knex) {
    return knex.schema.createTable('countries', function (table) {
      table.increments('id');
      table.string('country');
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('countries');
  };
  