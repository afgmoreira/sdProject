const db = require('../database');

module.exports = {
  getAll: async () => {
    return db.query(`
      SELECT *
      FROM countries
    `).then(q => q.rows);
  },

  getById: async (id) => {
    const countries = await db.query(`
      SELECT *
      FROM countries
      WHERE id = $1
    `, [id]).then(q => q.rows);

    if (countries.length > 0) {
      return countries[0];
    }

    throw new Error(`Country with countryId='${id}' not found!`);
  },

  create: async ({ country }) => {
    return db.query(`
      INSERT INTO countries (country)
      VALUES ($1)
      RETURNING *
    `, [country]).then(q => q.rows[0]);
  },

  updateById: async (id, { country }) => {
    return db.query(`
      UPDATE countries
      SET country = $2
      WHERE id = $1
      RETURNING *
    `, [id, country]).then(q => q.rows[0]);
  },

  deleteById: async (id) => {
    return db.query(`
      DELETE FROM countries
      WHERE id = $1
      RETURNING *
    `, [id]).then(q => q.rows[0]);
  }
};
