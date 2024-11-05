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
                SELECT AID AS ID, 'admin' AS role FROM admin WHERE username = @username AND password = @password
                UNION
                SELECT EID AS ID, 'employee' AS role FROM employee WHERE username = @username AND password = @password AND isManager = 0
                UNION
                SELECT EID AS ID, 'manager' AS role FROM employee WHERE username = @username AND password = @password AND isManager = 1
                UNION
                SELECT UID AS ID, 'customer' AS role FROM customer WHERE username = @username AND password = @password
                UNION
                SELECT UID AS ID, 'business' AS role FROM business WHERE username = @username AND password = @password
            `); //Assuming usernames and passwords pairs don't match across tables

        if (result.recordset.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const user = result.recordset[0];
        res.json({ message: 'Login successful', user });

    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post('/signup', async (req, res) => { 
    const { username, password, accountType } = req.body

    if (!username || !password || !accountType) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try{

        if(accountType === 'personal'){
            try {
                const result = await pool.request()
                    .input('username', sql.VarChar, username)
                    .input('password', sql.VarChar, password)
                    .query(`
                        INSERT INTO customer (username, password, createdAt) 
                        VALUES (@username, @password, GETDATE())
                    `);
                res.json({ message: 'Signup successful' });
            } catch (error) {
                console.error('Error during customer signup:', error.message);
                res.status(500).json({ message: 'Error signing up customer' });
            }
        }else if(accountType === 'business'){

            try {
                const result = await pool.request()
                    .input('username', sql.VarChar, username)
                    .input('password', sql.VarChar, password)
                    .query(`
                        INSERT INTO business (username, password, createdAt) 
                        VALUES (@username, @password, GETDATE())
                    `);
                res.json({ message: 'Signup successful' });
            } catch (error) {
                console.error('Error during business signup:', error.message);
                res.status(500).json({ message: 'Error signing up business' });
            }

        }else {
            return res.status(400).json({ message: 'Invalid account type' });
        }

    }catch (error) {
        console.error('Error during signup:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.post('/track', async (req, res) => {
    const { trackingNumber } = req.body;

    try {
        const result = await pool.request()
            .input('trackingNumber', sql.Int, trackingNumber)
            .query(`
                SELECT A.city, A.state, S.state as status, S.timeOfStatus 
                FROM trackingInfo AS T, addresses AS A, statuses as S, office as O
                WHERE T.trackingNumber = @trackingNumber AND T.currentStatus = S.SID AND S.currOID = O.OID AND O.officeAddress = A.addressID;
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Package doesn't exist" });
        }

        const trackingInfo = result.recordset[0];
        res.json({
            city: trackingInfo.city,
            state: trackingInfo.state,
            status: trackingInfo.status,
            timeOfStatus: trackingInfo.timeOfStatus
        });

    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;