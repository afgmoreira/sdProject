const fs = require('fs');
const parse = require('csv-parse');
const knexConfig = require('../knexfile');
const knex = require('knex')(knexConfig);

exports.up = async function (knex) {
  const filePath = '../circuits.csv';
  const fileContents = fs.readFileSync(filePath, 'utf8');

  const records = await new Promise((resolve, reject) => {
    parse(fileContents, { columns: true }, (err, records) => {
      if (err) reject(err);
      resolve(records);
    });
  });

  await knex.transaction(async (trx) => {
    for (const record of records) {
      // Insert record into the countries table
      const countryId = await trx('countries').insert({
        country: record.country,
      }).returning('id');

      // Insert record into the locations table
      const locationId = await trx('locations').insert({
        location: record.location,
      }).returning('id');

      // Insert record into the circuits table
      await trx('circuits').insert({
        circuit_id: record.circuitId,
        circuit_ref: record.circuitRef,
        name: record.name,
        lat: record.lat,
        lng: record.lng,
        alt: record.alt,
        url: record.url,
        country_id: countryId[0],
        location_id: locationId[0],
      });
    }
  });
};

exports.down = async function (knex) {
  // Delete all records from the circuits table
  await knex('circuits').del();

  // Delete all records from the countries table
  await knex('countries').del();

  // Delete all records from the locations table
  await knex('locations').del();
};
