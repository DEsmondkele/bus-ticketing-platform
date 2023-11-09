require('dotenv').config();
import knex from 'knex';

const db = knex({
  client: 'mysql2',
  connection: {
    host: process.env.DB_HOST as string,
    user: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_DATABASE as string,
  },
});

export default db;
