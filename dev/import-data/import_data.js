const fs = require('fs');
const csv = require('csv-parser');
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('sd', 'postgres', '12345', {
  host: 'localhost',
  dialect: 'postgres',
  define: {
    timestamps: false,
  },
});

console.log('Starting data import...');

const filePath = 'circuits.csv';
const fileStream = fs.createReadStream(filePath);
console.log('File Path:', filePath);

const records = [];

fileStream
  .pipe(csv())
  .on('data', (record) => {
    records.push(record);
  })
  .on('end', async () => {
    console.log('CSV parsing completed. Total records:', records.length);

    try {
      await sequelize.transaction(async (transaction) => {
        const Country = sequelize.define('countries', {
          country: DataTypes.STRING,
        });

        const Location = sequelize.define('locations', {
          location: DataTypes.STRING,
        });

        const Circuit = sequelize.define('circuits', {
          circuit_ref: DataTypes.STRING,
          name: DataTypes.STRING,
          lat: DataTypes.STRING,
          lng: DataTypes.STRING,
          alt: DataTypes.STRING,
          url: DataTypes.STRING,
        });

        // Drop existing tables before synchronization
       await Country.drop({ transaction, cascade: true });
        await Location.drop({ transaction, cascade: true });
        await Circuit.drop({ transaction, cascade: true });

        await sequelize.sync({ transaction });
        console.log('Database synchronization completed.');

        for (const record of records) {
          const country = await Country.create(
            { country: record.country },
            { transaction }
          );

          const location = await Location.create(
            { location: record.location },
            { transaction }
          );

          await Circuit.create(
            {
              circuit_ref: record.circuit_ref,
              name: record.name,
              lat: record.lat,
              lng: record.lng,
              alt: record.alt,
              url: record.url,
              country_id: country.id,
              location_id: location.id,
            },
            { transaction }
          );

          console.log('Record inserted:', record);
        }
      });

      console.log('Data import completed successfully.');
    } catch (error) {
      console.error('Error:', error);
    } finally {
      await sequelize.close();
      console.log('Database connection closed.');
    }
  });
