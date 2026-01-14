const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    port: 5433,
    database: 'aprobaciones_db',
    user: 'admin',
    password: 'admin123'
});


pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Error conectando a PostgreSQL:', err.message);
    } else {
        console.log('Conexión a PostgreSQL exitosa:', res.rows[0].now);
    }
});

module.exports = pool;