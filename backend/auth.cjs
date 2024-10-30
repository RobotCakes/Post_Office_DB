const express = require('express');
const sql = require('mssql');
const router = express.Router();
const pool = require('./index.cjs'); 

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.request()
            .input('username', sql.VarChar, username)
            .input('password', sql.VarChar, password) 
            .query(`
                SELECT AID, 'admin' AS role FROM admin WHERE username = @username AND password = @password
                UNION
                SELECT EID, 'employee' AS role FROM employee WHERE username = @username AND password = @password
                UNION
                SELECT UID, 'customer' AS role FROM customer WHERE username = @username AND password = @password
            `);

        if (result.recordset.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const user = result.recordset[0];
        res.json({ message: 'Login successful', user });
    } catch (error) {
        console.error('Error during login:', error.message); // Log error details
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;