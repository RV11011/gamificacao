const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  user: 'gamificacao_user',
  password: 'gamificacao_password',
  host: 'localhost',
  database: 'gamificacao_db',
  port: 5432
});

async function initDB() {
  try {
    const sqlPath = path.join(__dirname, 'init.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    await pool.query(sql);
    console.log('Banco de dados inicializado com sucesso');
  } catch (error) {
    console.error('Erro ao inicializar banco:', error);
  } finally {
    await pool.end();
  }
}

initDB();