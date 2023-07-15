exports.up = function (knex) {
  return knex.schema.createTable('circuits', function (table) {
    table.increments('id');
    table.string('circuitRef');
    table.string('name');
    table.string('lat');
    table.string('lng');
    table.decimal('alt');
    table.string('url');
    table.integer('country_id').unsigned();
    table.integer('location_id').unsigned();
    
    // Foreign key relationship with countries table
    table.foreign('country_id').references('countries.id');
    
    // Foreign key relationship with locations table
    table.foreign('location_id').references('locations.id');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('circuits');
};

  