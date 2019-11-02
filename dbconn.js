const Pool = require('pg').Pool;
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
    ssl: true
  };
};

const pool = new Pool(connString);
/**const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'teemworkdb',
  password: 'Adisababa123$@',
  port: 5432,
});**/

module.exports = pool;