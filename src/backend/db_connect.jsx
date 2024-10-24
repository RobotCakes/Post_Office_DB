const sql = require('mssql');
const config = {
    user: 'alejandro',
    password: 'Michaeljordan1990@',
    server: 'ohyeahmrpostman2.database.windows.net',
    database: 'group10',
    port: 1433,
    options: {
        encrypt: true
    }
};

var conn = new sql.ConnectionPool(config);

sql.connect(config)
    .then(() => console.log('Connected to database'))
    .catch(err => console.error('Failed to connect to database', err));

//exports.conn = conn;
exports.config = config;