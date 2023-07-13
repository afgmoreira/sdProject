const fs = require('fs');
const parse = require('csv-parse');
const knexConfig = require('./knexfile');
const knex = require('knex')(knexConfig);

exports.up = async function (knex) {
  const filePath = 'circuits.csv';
  const fileContents = fs.readFileSync(filePath, 'utf8');

  const records = await new Promise((resolve, reject) => {
    parse(fileContents, { columns: true }, (err, records) => {
      if (err) reject(err);
      resolve(records);
    });
  });

  await knex.transaction(async (trx) => {
    for (const record of records) {
      // Insert record into the circuits table
      await trx('circuits').insert({
        circuit_id: record.circuitId,
        circuit_ref: record.circuitRef,
        name: record.name,
        lat: record.lat,
        lng: record.lng,
        alt: record.alt,
        url: record.url,
        country_id: record.country, 
        location_id: record.location, 
      });
    }
  });
};

exports.down = async function (knex) {
  // Delete all records from the circuits table
  await knex('circuits').del();
};
