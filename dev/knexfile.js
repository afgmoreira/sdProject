module.exports = {
    development: {
      client: 'pg',
      connection: {
        host: 'localhost',
        user: 'postgres',
        password: '12345',
        database: 'sd',
      },
      migrations: {
        directory: './migrations',
      },
      seeds: {
        directory: './seeds',
      },
    },
  };
  