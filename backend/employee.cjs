// ------------ASHLEY-------------------------------------------------
const express = require('express');
const sql = require('mssql');
const router = express.Router();
const pool = require('./index.cjs'); 


router.post('/get-location', async (req, res) => {
    const {userID} =  req.body;
    try {
        const result = await pool.request().input('userID', sql.Int, userID)
            .query(`SELECT city, employee.OID FROM employee 
                JOIN office ON office.OID = employee.OID
                JOIN addresses ON addressID = office.officeAddress
                WHERE EID = @userID`);
        res.json(result.recordset);
    } catch (error) {
        console.error('Error fetching employee location:', error);
        res.status(500).json({ error: 'Failed to fetch employee info' });
    }
});

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
                        AND (S.state = 'In Transit' OR S.state = 'Created at Warehouse')
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
						AND E.EID = @userID AND S.currOID = E.OID
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
                VALUES ('Arrived at Post Office', @userID, GETDATE(), @office, @PID, NULL, @userRole, @trackingNumber);
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

router.post('/package-edit', async (req, res) => { 
    //console.log('Request body received:', req.body);
    const { trackingNumber, userID, userRole, selectedStatus, selectedOffice, currOID, PID } = req.body

    if (!trackingNumber) {
        return res.status(400).json({ message: 'Tracking number required.' });
    }

    if(!userRole || !userID) {
        return res.status(400).json({ message: 'Invalid  user.' });
    }

    if (!selectedStatus || !currOID || !PID){
        return res.status(400).json({ message: 'Missing information.' });
    }

    try {
        
        const newStatus = await pool.request()
            .input('trackingNumber', sql.Int, trackingNumber)
            .input('userID', sql.Int, userID)   
            .input('userRole', sql.VarChar, userRole)
            .input('PID', sql.Int, PID)
            .input('selectedStatus', sql.VarChar, selectedStatus)
            .input('selectedOffice', sql.TinyInt, selectedOffice)
            .input('currOID', sql.TinyInt, currOID)
            .query(`
                INSERT INTO dbo.statuses (state, updatedBy, timeOfStatus, currOID, PID, nextOID, userTypeUpdate, trackingNumber)
                VALUES (@selectedStatus, @userID, GETDATE(), @currOID, @PID, CASE WHEN @selectedStatus = 'In transit' THEN @selectedOffice ELSE NULL END, @userRole, @trackingNumber);
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

router.post('/package-delete', async (req, res) => { 
    //console.log('Request body received:', req.body);
    const { trackingNumber, userID, userRole, PID, currOID } = req.body

    if (!trackingNumber || !PID) {
        return res.status(400).json({ message: 'Tracking number required.' });
    }

    if(!userRole || !userID) {
        return res.status(400).json({ message: 'Invalid  user.' });
    }


    try {
        
        const newStatus = await pool.request()
            .input('trackingNumber', sql.Int, trackingNumber)
            .input('userID', sql.Int, userID)   
            .input('userRole', sql.VarChar, userRole)
            .input('PID', sql.Int, PID)
            .input('currOID', sql.TinyInt, currOID)
            .query(`
                INSERT INTO dbo.statuses (state, updatedBy, timeOfStatus, currOID, PID, nextOID, userTypeUpdate, trackingNumber)
                VALUES ('Cancelled', @userID, GETDATE(), @currOID, @PID, NULL, @userRole, @trackingNumber);
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
        
        // 'Deleting' packages
        await pool.request()
            .input('PID', sql.Int, PID)
            .query(`
                UPDATE package
                SET isDeleted = 1
                WHERE PID = @PID;
            `);

        res.json({ success: true });
    } catch (error) {
        console.error('Error updating package status:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }    
});




module.exports = router;
// ------------ASHLEY (END)-------------------------------------------------
