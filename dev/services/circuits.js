const db = require('../database');

module.exports = {
  getAll: async () => {
    return db.query(`
      SELECT *
      FROM circuits
    `).then(q => q.rows);
  },

  getById: async (circuitId) => {
    const circuits = await db.query(`
      SELECT *
      FROM circuits
      WHERE circuitId = $1
    `, [circuitId]).then(q => q.rows);

    if (circuits.length > 0) {
      return circuits[0];
    }

    throw new Error(`Circuit with circuitId='${circuitId}' not found!`);
  },

  create: async ({ circuitRef, name, lat, lng, alt, url }) => {
    return db.query(`
      INSERT INTO circuits (circuitRef, name, lat, lng, alt, url)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `, [circuitRef, name, lat, lng, alt, url]).then(q => q.rows[0]);
  },

  updateById: async (circuitId, { circuitRef, name, lat, lng, alt, url }) => {
    return db.query(`
      UPDATE circuits
      SET circuitRef = $2, name = $3, lat = $4, lng = $5, alt = $6, url = $7
      WHERE circuitId = $1
      RETURNING *
    `, [circuitId, circuitRef, name, lat, lng, alt, url]).then(q => q.rows[0]);
  },

  deleteById: async (circuitId) => {
    return db.query(`
      DELETE FROM circuits
      WHERE circuitId = $1
      RETURNING *
    `, [circuitId]).then(q => q.rows[0]);
  },

  getLocationById: async (circuitId) => {
    return db.query(`
      SELECT *
      FROM locations
      WHERE circuitId = $1
    `, [circuitId]).then(q => q.rows);
  },

  getCountryById: async (circuitId) => {
    return db.query(`
      SELECT *
      FROM countries
      WHERE circuitId = $1
    `, [circuitId]).then(q => q.rows);
  },
};
