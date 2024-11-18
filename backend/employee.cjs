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
                        AND P.isDeleted = 0 
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
                        AND P.isDeleted = 0
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

router.post('/create-package', async (req, res) => {
    const { userID, userRole, senderUID, content, firstName, middleInitial, lastName, streetAddress, city, state, zipcode, country,
        packageHeight, packageLength, packageWidth, weight, isDelivery, deliveryPriority, isFragile, 
        specialInstructions, deliverPrice, currOID } = req.body

    try {
        const senderInfo = await pool.request()
            .input('userID', sql.Int, senderUID)
            .query('SELECT name, address FROM customer WHERE UID = @userID');

        if (!senderInfo.recordset.length) {
            throw new Error(`No customer found with UID: ${userID}`);
        }


        const nameResult = await pool.request()
            .input('firstName', sql.VarChar, firstName)
            .input('middleInitial', sql.VarChar, middleInitial)
            .input('lastName', sql.VarChar, lastName)
            .query(`
                INSERT INTO names (firstName, middleInitial, lastName) 
                VALUES (@firstName, @middleInitial, @lastName); 
                SELECT SCOPE_IDENTITY() AS name_id;
            `);

        const nameID = nameResult.recordset[0].name_id;

        
        const addressResult = await pool.request()
            .input('streetAddress', sql.VarChar, streetAddress)
            .input('city', sql.VarChar, city)
            .input('state', sql.VarChar, state)
            .input('zipcode', sql.Int, zipcode)
            .input('country', sql.VarChar, country)
            .query(`
                INSERT INTO addresses (streetAddress, city, state, zipcode, country) 
                VALUES (@streetAddress, @city, @state, @zipcode, @country);
                SELECT SCOPE_IDENTITY() AS address_id;
            `);

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
            .input('userID', sql.Int, userID)
            .input('receiverName', sql.Int, nameID)
            .input('receiverAddress', sql.Int, addressID) // Always assume receiver is guest (user can add package to history with tracknum)
            .query(`
                INSERT INTO trackinginfo (senderName, senderAddress, receiverName, receiverAddress, receiverUID, senderUID, expectedDelivery)
                VALUES (@senderName, @senderAddress, @receiverName, @receiverAddress, @userID, NULL, ${expectedDelivery});
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
            .input('trackingNumber', sql.Int, trackingNumber)
            .query(`
                INSERT INTO package (trackingNumber, packageContent, packageLength, packageWidth,
                    packageHeight, weight, deliverPrice, isDelivery, deliveryPriority, specialInstructions, isFragile)
                VALUES (@trackingNumber, @content, @length, @width, @height, @weight, @price, @isDelivery, @prio, @inst, @isFragile); 
                SELECT SCOPE_IDENTITY() AS PID;
            `);

        const PID = createPackage.recordset[0].PID;
        
        const createStatus = await pool.request()
            .input('currOID', sql.TinyInt, currOID)
            .input('PID', sql.Int, PID)
            .input('userID', sql.Int, userID)
            .input('userRole', sql.VarChar, userRole)
            .input('trackingNumber', sql.Int, trackingNumber)
            .query(`
                INSERT INTO statuses(state, updatedBy, timeOfStatus, currOID, PID, nextOID, userTypeUpdate, trackingNumber)
                Values ('Created at Post Office', @userID, GETDATE(), @currOID, @PID, NULL, @userRole, @trackingNumber);
                SELECT SCOPE_IDENTITY() AS SID;
            `);

        const SID = createStatus.recordset[0].SID;

        await pool.request()
            .input('SID', sql.Int, SID)
            .input('trackingNumber', sql.Int, trackingNumber)
            .query(`
                UPDATE trackinginfo
                SET currentStatus = @SID
                WHERE trackinginfo.trackingNumber = @trackingNumber;
            `);

        res.json({ success: true });
    } catch (error) {
        console.error('Error creating package:', error);
        res.status(500).json({ error: 'Failed to create package' });
    }
});

router.post('/employee-info', async (req, res) => { 
    const { userID } = req.body

    if(!userID){
        return res.status(400).json({ message: 'User not logged in.' });
    }

    try {
        
        const result = await pool.request()
            .input('userID', sql.Int, userID)
            .query(` 
                SELECT firstName, middleInitial, lastName, password, phoneNumber, email
                FROM employee
                JOIN names ON nameID = employeeName
                WHERE EID = @userID;
            `);
        
        res.json(result.recordset[0]);
    } catch (error) {
        console.error('Error fetching employee info:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }    
});


router.post('/update-info', async (req, res) => { 
    const { userID, userRole, firstName, middleInitial, lastName, streetAddress, city, state, zipcode, country, password, email, phoneNumber} = req.body

    if(!userID){
        return res.status(400).json({ message: 'User not logged in.' });
    }

    try {
        const nameResult = await pool.request()
            .input('userID', sql.Int, userID)
            .query(`
                SELECT employeeName
                FROM employee 
                WHERE EID = @userID;
            `);

        const nameID = nameResult.recordset[0].employeeName;

        await pool.request()
            .input('firstName', sql.VarChar, firstName)
            .input('lastName', sql.VarChar, lastName)
            .input('middleInitial', sql.VarChar, middleInitial)
            .input('nameID', sql.Int, nameID)
            .query(`
                UPDATE names
                SET firstName = @firstName, lastName = @lastName, middleInitial = @middleInitial
                WHERE nameID = @nameID;
            `);
        
        await pool.request()
            .input('userID', sql.Int, userID)
            .input('password', sql.VarChar, password)
            .input('phoneNumber', sql.VarChar, phoneNumber)
            .input('email', sql.VarChar, email)
            .input('userRole', sql.VarChar, userRole)
            .query(`
                UPDATE employee
                SET password = @password, phoneNumber = @phoneNumber, email = @email, userTypeModify = @userRole, lastUpdatedAt = GETDATE(), lastUpdatedBy = @userID
                WHERE EID = @userID;
            `);
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error updating user info:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }    
});

module.exports = router;
// ------------ASHLEY (END)-------------------------------------------------
