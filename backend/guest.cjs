// ------------ASHLEY-------------------------------------------------
const express = require('express');
const sql = require('mssql');
const router = express.Router();
const pool = require('./index.cjs'); 

// Login auth
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
            `);

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


// Improved sign up with a trigger to check for matching usernames
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
                
                // Done after the customer insert in case the trigger for username goes off
                const nameResult = await pool.request() // Inserting nulls so the user can fill it out later
                    .query(`
                        INSERT INTO names (firstName, middleInitial, lastName) 
                        VALUES (null, null, null); 
                        SELECT SCOPE_IDENTITY() AS name_id;
                    `);

                const nameID = nameResult.recordset[0].name_id;

                
                const addressResult = await pool.request()
                    .query(`
                        INSERT INTO addresses (streetAddress) 
                        VALUES (null);
                        SELECT SCOPE_IDENTITY() AS address_id;
                    `);

                const addressID = addressResult.recordset[0].address_id;

                
                await pool.request()
                    .input('addressID', sql.Int, addressID)
                    .input('nameID', sql.Int, nameID)
                    .input('username', sql.VarChar, username)
                    .query(`
                        UPDATE customer
                        SET name = @nameID, address = @addressID
                        WHERE username = @username;
                    `);

                res.json({ message: 'Signup successful' });
            } catch (error) {
                console.error('Error during customer signup:', error.message);
                if (error.message.includes('Username already exists')) {
                    return res.status(400).json({ message: 'Username already exists.' });
                }
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

                // Same stuff as customer just some changes to ownerName and warehouseAddress     
                const nameResult = await pool.request()
                    .query(`
                        INSERT INTO names (firstName, middleInitial, lastName) 
                        VALUES (null, null, null); 
                        SELECT SCOPE_IDENTITY() AS name_id;
                    `);

                const nameID = nameResult.recordset[0].name_id;

                
                const addressResult = await pool.request()
                    .query(`
                        INSERT INTO addresses (streetAddress) 
                        VALUES (null);
                        SELECT SCOPE_IDENTITY() AS address_id;
                    `);

                const addressID = addressResult.recordset[0].address_id;

                
                await pool.request()
                    .input('addressID', sql.Int, addressID)
                    .input('nameID', sql.Int, nameID)
                    .input('username', sql.VarChar, username)
                    .query(`
                        UPDATE business
                        SET ownerName = @nameID, warehouseAddress = @addressID
                        WHERE username = @username;
                    `);

                res.json({ message: 'Signup successful' });
            } catch (error) {
                console.error('Error during business signup:', error.message);
                if (error.message.includes('Username already exists')) {
                    return res.status(400).json({ message: 'Username already exists.' });
                }
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

// Return status but it's like a simplified version
router.post('/track', async (req, res) => {
    const { trackingNumber } = req.body;

    try {
        const result = await pool.request()
            .input('trackingNumber', sql.Int, trackingNumber)
            .query(`
                SELECT A.city, A.state, S.state as status, S.timeOfStatus, T.expectedDelivery 
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
            timeOfStatus: trackingInfo.timeOfStatus,
            expectedDelivery: trackingInfo.expectedDelivery
        });

    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
// ------------ASHLEY (END)-------------------------------------------------