const db = require('../database');
const jwt = require("jsonwebtoken");

module.exports = {
  getAll: async () => {
    return db.query(`
      SELECT *
      FROM users
    `).then(q => q.rows);
  },

  getById: async (userId) => {
    const users = await db.query(`
      SELECT *
      FROM users
      WHERE userId = $1
    `, [userId]).then(q => q.rows);

    if (users.length > 0) {
      return users[0];
    }

    throw new Error(`User with userId='${userId}' not found!`);
  },

  create: async ({ username, password, role }) => {
    return db.query(`
      INSERT INTO users (username, password, role)
      VALUES ($1, $2, $3)
      RETURNING *
    `, [username, password, role]).then(q => q.rows[0]);
  },

  updateById: async (userId, { username, password, role }) => {
    const users = await db.query(
      `
      UPDATE users
      SET username = $1, password = $2, role = $3
      WHERE userId = $4
      RETURNING *
    `,
      [username, password, role, userId]
    ).then(q => q.rows);
  
    if (users.length > 0) {
      return users[0];
    }
  
    throw new Error(`User with userId='${userId}' not found!`);
  },
  
  deleteById: async (userId) => {
    const users = await db.query(
      `
      DELETE FROM users
      WHERE userId = $1
      RETURNING *
    `,
      [userId]
    ).then(q => q.rows);
  
    if (users.length > 0) {
      return users[0];
    }
  
    throw new Error(`User with userId='${userId}' not found!`);
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
