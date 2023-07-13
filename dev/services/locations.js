const db = require('../database');

module.exports = {
  getAll: async () => {
    return db.query(`
      SELECT *
      FROM locations
    `).then(q => q.rows);
  },

  getById: async (locationId) => {
    const locations = await db.query(`
      SELECT *
      FROM locations
      WHERE locationId = $1
    `, [locationId]).then(q => q.rows);

    if (locations.length > 0) {
      return locations[0];
    }

    throw new Error(`Location with locationId='${locationId}' not found!`);
  },

  create: async ({ location }) => {
    return db.query(`
      INSERT INTO locations (location)
      VALUES ($1)
      RETURNING *
    `, [location]).then(q => q.rows[0]);
  },

  updateById: async (locationId, { location }) => {
    return db.query(`
      UPDATE locations
      SET location = $2
      WHERE locationId = $1
      RETURNING *
    `, [locationId, location]).then(q => q.rows[0]);
  },

  deleteById: async (locationId) => {
    return db.query(`
      DELETE FROM locations
      WHERE locationId = $1
      RETURNING *
    `, [locationId]).then(q => q.rows[0]);
  }
};
