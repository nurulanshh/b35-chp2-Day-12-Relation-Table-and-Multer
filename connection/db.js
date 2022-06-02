const { Pool } = require('pg');

const dbPool = new Pool({
  database: 'b35_personal_web',
  port: '5500',
  user: 'postgres',
  password: 'gitar12345',
});

module.exports = dbPool;