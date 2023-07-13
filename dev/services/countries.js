const db = require('../database');

module.exports = {
  getAll: async () => {
    return db.query(`
      SELECT *
      FROM countries
    `).then(q => q.rows);
  },

  getById: async (countryId) => {
    const countries = await db.query(`
      SELECT *
      FROM countries
      WHERE countryId = $1
    `, [countryId]).then(q => q.rows);

    if (countries.length > 0) {
      return countries[0];
    }

    throw new Error(`Country with countryId='${countryId}' not found!`);
  },

  create: async ({ country }) => {
    return db.query(`
      INSERT INTO countries (country)
      VALUES ($1)
      RETURNING *
    `, [country]).then(q => q.rows[0]);
  },

  updateById: async (countryId, { country }) => {
    return db.query(`
      UPDATE countries
      SET country = $2
      WHERE countryId = $1
      RETURNING *
    `, [countryId, country]).then(q => q.rows[0]);
  },

  deleteById: async (countryId) => {
    return db.query(`
      DELETE FROM countries
      WHERE countryId = $1
      RETURNING *
    `, [countryId]).then(q => q.rows[0]);
  }
};
