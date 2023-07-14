exports.up = function (knex) {
  return knex.schema.createTable('circuits', function (table) {
    table.string('circuitId').primary();
    table.string('circuitRef');
    table.string('name');
    table.string('lat');
    table.string('lng');
    table.decimal('alt');
    table.string('url');
    
    // Foreign key relationship with countries table
    table.string('country_id').references('id').inTable('countries').onDelete('CASCADE');
    
    // Foreign key relationship with locations table
    table.string('location_id').references('id').inTable('locations').onDelete('CASCADE');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('circuits');
};

  