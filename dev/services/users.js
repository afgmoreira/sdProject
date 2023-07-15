const db = require('../database');
const jwt = require("jsonwebtoken");

module.exports = {
  getAll: async () => {
    return db.query(`
      SELECT *
      FROM users
    `).then(q => q.rows);
  },

  getById: async (id) => {
    const users = await db.query(`
      SELECT *
      FROM users
      WHERE id = $1
    `, [id]).then(q => q.rows);

    if (users.length > 0) {
      return users[0];
    }

    throw new Error(`User with userId='${id}' not found!`);
  },

  create: async ({ username = "", password = "", role = "" }) => {
    return db.query(`
      INSERT INTO users (username, password, role)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [username, password, role]).then(q => q.rows[0]);
  },

  updateById: async (id, { username, password, role }) => {
    const users = await db.query(
      `
      UPDATE users
      SET username = $1, password = $2, role = $3
      WHERE id = $4
      RETURNING *
    `,
      [username, password, role, id]
    ).then(q => q.rows);
  
    if (users.length > 0) {
      return users[0];
    }
  
    throw new Error(`User with userId='${id}' not found!`);
  },
  
  deleteById: async (id) => {
    const users = await db.query(
      `
      DELETE FROM users
      WHERE id = $1
      RETURNING *
    `,
      [id]
    ).then(q => q.rows);
  
    if (users.length > 0) {
      return users[0];
    }
  
    throw new Error(`User with userId='${id}' not found!`);
  },


  getByUsername: async (username) => {
    const users = await db.query(`
      SELECT *
      FROM users
      WHERE username = $1
    `, [username]).then(q => q.rows);

    if (users.length > 0) {
      return users[0];
    }

    return null;
  }


};
