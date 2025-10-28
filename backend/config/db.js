// config/db.js
require('dotenv').config(); // doit être en tout début du fichier

const { Pool } = require('pg');

// Créer le pool de connexion PostgreSQL
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: Number(process.env.PGPORT),
});

// Test de connexion immédiat
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Erreur PostgreSQL :', err);
  } else {
    console.log('✅ PostgreSQL OK :', res.rows[0]);
  }
});

module.exports = pool;
