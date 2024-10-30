//Connecting to DB
const sql = require('mssql');
const config = {
    user: 'ashley',
    password: 'Jameharden4000@',
    server: 'ohyeahmrpostman2.database.windows.net',
    database: 'group10',
    port: 1433,
    options: {
        encrypt: true,
        trustServerCertificate: false
    }
};

const pool = new sql.ConnectionPool(config);

pool.connect()
    .then(() => {
        console.log('Connected to database');
    })
    .catch(err => {
        console.error('Failed to connect to database', err);
    });


