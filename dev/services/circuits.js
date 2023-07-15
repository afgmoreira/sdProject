const db = require('../database');

module.exports = {
  getAll: async () => {
    return db.query(`
      SELECT *
      FROM circuits
    `).then(q => q.rows);
  },

  getById: async (id) => {
    const circuits = await db.query(`
      SELECT *
      FROM circuits
      WHERE circuitId = $1
    `, [id]).then(q => q.rows);

    if (circuits.length > 0) {
      return circuits[0];
    }

    throw new Error(`Circuit with circuitId='${id}' not found!`);
  },

  create: async ({ circuitRef, name, lat, lng, alt, url }) => {
    return db.query(`
      INSERT INTO circuits (circuitRef, name, lat, lng, alt, url)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [circuitRef, name, lat, lng, alt, url]).then(q => q.rows[0]);
  },

  updateById: async (id, { circuitRef, name, lat, lng, alt, url }) => {
    return db.query(`
      UPDATE circuits
      SET circuitRef = $2, name = $3, lat = $4, lng = $5, alt = $6, url = $7
      WHERE id = $1
      RETURNING *
    `, [id, circuitRef, name, lat, lng, alt, url]).then(q => q.rows[0]);
  },

  deleteById: async (id) => {
    return db.query(`
      DELETE FROM circuits
      WHERE id = $1
      RETURNING *
    `, [id]).then(q => q.rows[0]);
  },

  getLocationById: async (id) => {
    return db.query(`
      SELECT *
      FROM locations
      WHERE id = $1
    `, [id]).then(q => q.rows);
  },

  getCountryById: async (id) => {
    return db.query(`
      SELECT *
      FROM countries
      WHERE id = $1
    `, [id]).then(q => q.rows);
  },
};
