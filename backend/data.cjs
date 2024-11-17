// ------------ASHLEY-------------------------------------------------
const express = require('express');
const sql = require('mssql');
const router = express.Router();
const pool = require('./index.cjs'); 

router.post('/get-prio', async (req, res) => {
    try {
        const result = await pool.request().query('SELECT * FROM deliveryprio;');
        res.json(result.recordset);
    } catch (error) {
        console.error('Error fetching delivery priorities:', error);
        res.status(500).json({ error: 'Failed to fetch delivery priorities' });
    }
});

router.post('/get-offices', async (req, res) => {
    try {
        const result = await pool.request().query('SELECT OID, city FROM office JOIN addresses ON officeAddress = addressID;');
        res.json(result.recordset);
    } catch (error) {
        console.error('Error fetching delivery priorities:', error);
        res.status(500).json({ error: 'Failed to fetch delivery priorities' });
    }
});

router.post('/business-create-package', async (req, res) => {
    const { userID, content, firstName, middleInitial, lastName, streetAddress, city, state, zipcode, country,
        packageHeight, packageLength, packageWidth, weight, isDelivery, deliveryPriority, isFragile, 
        specialInstructions, deliverPrice, nextOID } = req.body

    try {
        const businessInfo = await pool.request()
            .input('userID', sql.Int, userID)
            .query('SELECT ownerName, warehouseAddress FROM business WHERE UID = @userID');

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
            .input('senderName', sql.Int, businessInfo.recordset[0].ownerName)
            .input('senderAddress', sql.Int, businessInfo.recordset[0].warehouseAddress)
            .input('userID', sql.Int, userID)
            .input('receiverName', sql.Int, nameID)
            .input('receiverAddress', sql.Int, addressID) // Always assume receiver is guest (user can add package to history with tracknum)
            .query(`
                INSERT INTO trackinginfo (senderName, senderAddress, receiverName, receiverAddress, receiverUID, senderUID, expectedDelivery)
                VALUES (@senderName, @senderAddress, @receiverName, @receiverAddress, @userID, @userID, ${expectedDelivery});
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
            .input('nextOID', sql.TinyInt, nextOID)
            .input('PID', sql.Int, PID)
            .input('userID', sql.Int, userID)
            .input('trackingNumber', sql.Int, trackingNumber)
            .query(`
                INSERT INTO statuses(state, updatedBy, timeOfStatus, currOID, PID, nextOID, userTypeUpdate, trackingNumber)
                Values ('Created at Warehouse', @userID, GETDATE(), NULL, @PID, @nextOID, 'Business', @trackingNumber);
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
        console.error('Error fetching delivery priorities:', error);
        res.status(500).json({ error: 'Failed to fetch delivery priorities' });
    }
});

module.exports = router;
// ------------ASHLEY (END)-------------------------------------------------