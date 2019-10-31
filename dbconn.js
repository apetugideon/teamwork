const Pool = require('pg').Pool;

const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'teemworkdb',
  password: 'Adisababa123$@',
  port: 5432,
});

module.exports = pool;