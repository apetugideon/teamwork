const { Pool } = require('pg');

const env = process.env.NODE_ENV || 'development';

let connString = {};

if (env === 'development') {
  connString = {
    user: 'me',
    host: 'localhost',
    database: 'teemworkdb',
    password: 'Adisababa123$@',
    port: 5432,
  };
} else {
  connString = {
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  };
}

const pool = new Pool(connString);

module.exports = pool;
