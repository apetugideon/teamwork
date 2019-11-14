const { Pool } = require('pg');

const env = process.env.NODE_ENV || 'development';

let connString = {};

if (!process.env.DATABASE_URL) {
  console.log("Here 1");
  connString = require("./dbparam");
} else {
  console.log("Here 2");
  connString = {
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  };
}
const pool = new Pool(connString);

module.exports = pool;
