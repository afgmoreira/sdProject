const db = require('../database');

module.exports = {
  getAll: async () => {
    return db.query(`
      SELECT *
      FROM locations
    `).then(q => q.rows);
  },

  getById: async (id) => {
    const locations = await db.query(`
      SELECT *
      FROM locations
      WHERE id = $1
    `, [id]).then(q => q.rows);

    if (locations.length > 0) {
      return locations[0];
    }

    throw new Error(`Location with locationId='${id}' not found!`);
  },

  create: async ({ location }) => {
    return db.query(`
      INSERT INTO locations (location)
      VALUES ($1)
      RETURNING *
    `, [location]).then(q => q.rows[0]);
  },

  updateById: async (id, { location }) => {
    return db.query(`
      UPDATE locations
      SET location = $2
      WHERE id = $1
      RETURNING *
    `, [id, location]).then(q => q.rows[0]);
  },

  deleteById: async (id) => {
    return db.query(`
      DELETE FROM locations
      WHERE id = $1
      RETURNING *
    `, [id]).then(q => q.rows[0]);
  }
};
