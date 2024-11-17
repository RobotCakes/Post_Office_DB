// ------------ASHLEY-------------------------------------------------
const express = require('express');
const sql = require('mssql');
const router = express.Router();
const pool = require('./index.cjs'); 

router.post('/get-incoming', async (req, res) => { 
    const { userID } = req.body

    if (!userID) {
        return res.status(400).json({ message: 'User is not logged in.' });
    }

    try {
        const result = await pool.request()
            .input('userID', sql.Int, userID)
            .query(`
                SELECT P.trackingNumber, S.state as status, S.timeOfStatus, P.deliveryPriority, P.PID
                FROM trackinginfo as T, statuses as S, package as P, employee as E
                WHERE P.trackingNumber = T.trackingNumber
                        AND S.SID = T.currentStatus AND (S.state <> 'Delivered' AND S.state <> 'Cancelled')
                        AND P.isDeleted = 'false' 
						AND E.EID = @userID AND S.nextOID = E.OID
                        AND S.state <> 'Arrived at Post Office'
                ORDER BY P.deliveryPriority ASC;
            `);
        res.json(result.recordset);
    } catch (error) {
        console.error('Error fetching package status:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }    
});

router.post('/get-at-office', async (req, res) => { 
    const { userID } = req.body

    if (!userID) {
        return res.status(400).json({ message: 'User is not logged in.' });
    }

    try {
        const result = await pool.request()
            .input('userID', sql.Int, userID)
            .query(`
                SELECT P.trackingNumber, S.state as status, S.timeOfStatus, P.deliveryPriority, P.PID
                FROM trackinginfo as T, statuses as S, package as P, employee as E
                WHERE P.trackingNumber = T.trackingNumber
                        AND S.SID = T.currentStatus AND (S.state <> 'Delivered' AND S.state <> 'Cancelled')
                        AND P.isDeleted = 'false' 
						AND E.EID = @userID AND S.nextOID = E.OID
                ORDER BY P.deliveryPriority ASC;
            `);
        res.json(result.recordset);
    } catch (error) {
        console.error('Error fetching package status:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }    
});

router.post('/package-arrive', async (req, res) => { 
    const { trackingNumber, userRole, userID, PID } = req.body

    if (!trackingNumber) {
        return res.status(400).json({ message: 'Tracking number required.' });
    }

    if(!userRole || !userID) {
        return res.status(400).json({ message: 'Invalid  user.' });
    }

    try {

        const employeeOffice = await pool.request()
            .input('userID', sql.Int, userID)
            .query(`
                SELECT OID FROM employee WHERE EID = @userID;
            `);
           
        const office = employeeOffice.recordset[0].OID;

        const newStatus = await pool.request()
            .input('trackingNumber', sql.Int, trackingNumber)
            .input('userID', sql.Int, userID)
            .input('userRole', sql.VarChar, userRole)
            .input('office', sql.TinyInt, office)
            .input('PID', sql.Int, PID)
            .query(`
                INSERT INTO dbo.statuses (state, updatedBy, timeOfStatus, currOID, PID, nextOID, userTypeUpdate, trackingNumber)
                VALUES ('Arrived at Post Office', @userID, GETDATE(), @office, @PID, @office, @userRole, @trackingNumber);
                SELECT SCOPE_IDENTITY() AS SID;
            `);

        const SID = newStatus.recordset[0].SID;

        await pool.request()
            .input('trackingNumber', sql.Int, trackingNumber)
            .input('SID', sql.Int, SID)
            .query(`
                UPDATE trackinginfo
                SET currentStatus = @SID
                WHERE trackingNumber = @trackingNumber;
            `);

        res.json({ success: true });
    } catch (error) {
        console.error('Error updating package status:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }    
});


module.exports = router;
// ------------ASHLEY (END)-------------------------------------------------
