//ASHLEY
const express = require('express');
const sql = require('mssql');
const router = express.Router();
const pool = require('./index.cjs');

// Route to get the employee's location information
router.post('/get-location', async (req, res) => {
    const { userID } = req.body;
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

// Route to get incoming packages for an employee
router.post('/get-incoming', async (req, res) => { 
    const { userID } = req.body;

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

// Route to get packages currently at the office
router.post('/get-at-office', async (req, res) => { 
    const { userID } = req.body;

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

// Route to mark a package as "arrived at the post office"
router.post('/package-arrive', async (req, res) => { 
    const { trackingNumber, userRole, userID, PID } = req.body;

    if (!trackingNumber) {
        return res.status(400).json({ message: 'Tracking number required.' });
    }

    if (!userRole || !userID) {
        return res.status(400).json({ message: 'Invalid user.' });
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

// Route to edit a package's status
router.post('/package-edit', async (req, res) => { 
    const { trackingNumber, userID, userRole, selectedStatus, selectedOffice, currOID, PID } = req.body;

    if (!trackingNumber) {
        return res.status(400).json({ message: 'Tracking number required.' });
    }

    if (!userRole || !userID) {
        return res.status(400).json({ message: 'Invalid user.' });
    }

    if (!selectedStatus || !currOID || !PID) {
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

// Route to delete a package
router.post('/package-delete', async (req, res) => { 
    const { trackingNumber, userID, userRole, PID, currOID } = req.body;

    if (!trackingNumber || !PID) {
        return res.status(400).json({ message: 'Tracking number required.' });
    }

    if (!userRole || !userID) {
        return res.status(400).json({ message: 'Invalid user.' });
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

// Route to create a new package
router.post('/create-package', async (req, res) => {
    const { trackingNumber, userID, userRole, deliveryPriority, packageInfo } = req.body;

    if (!trackingNumber || !userID || !userRole || !deliveryPriority || !packageInfo) {
        return res.status(400).json({ message: 'Missing information.' });
    }

        const addressID = addressResult.recordset[0].address_id;

        // Getting expected delivery
        let expectedDelivery;
        switch (deliveryPriority) {
            case '0': // Overnight
                expectedDelivery = 'DATEADD(day, 1, GETDATE())';
                break;
            case '1': // Express
                expectedDelivery = 'DATEADD(day, 3, GETDATE())';
                break;
            case '2': // Normal
                expectedDelivery = 'DATEADD(day, 7, GETDATE())';
                break;
            default:
                expectedDelivery = 'DATEADD(day, 7, GETDATE())'; // default
                break;
        }

        const createTracking = await pool.request()
            .input('senderName', sql.Int, senderInfo.recordset[0].name)
            .input('senderAddress', sql.Int, senderInfo.recordset[0].address)
            .input('userID', sql.Int, senderUID)
            .input('receiverName', sql.Int, nameID)
            .input('receiverAddress', sql.Int, addressID) // Always assume receiver is guest (user can add package to history with tracknum)
            .query(`
                INSERT INTO trackinginfo (senderName, senderAddress, receiverName, receiverAddress, receiverUID, senderUID, expectedDelivery)
                VALUES (@senderName, @senderAddress, @receiverName, @receiverAddress, NULL, @userID, ${expectedDelivery});
                SELECT SCOPE_IDENTITY() AS trackingNumber;
            `);
        
        const trackingNumber = createTracking.recordset[0].trackingNumber;

        const createPackage = await pool.request()
            .input('content', sql.VarChar, content)
            .input('length', sql.Float, packageLength)
            .input('width', sql.Float, packageWidth)
            .input('height', sql.Float, packageHeight)
            .input('weight', sql.Float, weight)
            .input('price', sql.Float, deliverPrice)
            .input('isDelivery', sql.Bit, isDelivery)
            .input('prio', sql.Int, deliveryPriority)
            .input('inst', sql.VarChar, specialInstructions)
            .input('isFragile', sql.Bit, isFragile)

    try {
        const result = await pool.request()

            .input('trackingNumber', sql.Int, trackingNumber)
            .input('userID', sql.Int, userID)
            .input('userRole', sql.VarChar, userRole)
            .input('deliveryPriority', sql.Int, deliveryPriority)
            .input('packageInfo', sql.VarChar, packageInfo)
            .query(`
                INSERT INTO dbo.package (trackingNumber, deliveryPriority, packageInfo, isDeleted)
                VALUES (@trackingNumber, @deliveryPriority, @packageInfo, 0);
            `);

        res.json({ success: true });
    } catch (error) {
        console.error('Error creating package:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Routes for employee management
router.get('/get-all-employees', async (req, res) => {
    try {
        const result = await pool.request()
            .query(`SELECT EID, firstName, lastName, position FROM employee`);
        res.json(result.recordset);
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ error: 'Failed to fetch employees' });
    }
});

router.post('/add-employee', async (req, res) => {
    const { firstName, lastName, position, officeID } = req.body;

    try {
        const result = await pool.request()
            .input('firstName', sql.VarChar, firstName)
            .input('lastName', sql.VarChar, lastName)
            .input('position', sql.VarChar, position)
            .input('officeID', sql.Int, officeID)
            .query(`
                INSERT INTO employee (firstName, lastName, position, OID)
                VALUES (@firstName, @lastName, @position, @officeID)
            `);

        res.json({ success: true });
    } catch (error) {
        console.error('Error adding employee:', error);
        res.status(500).json({ error: 'Failed to add employee' });
    }
});

router.post('/remove-employee', async (req, res) => {
    const { EID } = req.body;

    try {
        await pool.request()
            .input('EID', sql.Int, EID)
            .query(`DELETE FROM employee WHERE EID = @EID`);

        res.json({ success: true });
    } catch (error) {
        console.error('Error removing employee:', error);
        res.status(500).json({ error: 'Failed to remove employee' });
    }
});

module.exports = router;
