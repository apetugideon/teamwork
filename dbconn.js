const { Pool } = require('pg');

const env = process.env.NODE_ENV || 'development';

let connString = {};

if (!process.env.DATABASE_URL) {
  connString = require("./dbparam");
} else {
  connString = {
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  };
}
const pool = new Pool(connString);

module.exports = pool;
