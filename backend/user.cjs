// ------------ASHLEY-------------------------------------------------
const express = require('express');
const sql = require('mssql');
const router = express.Router();
const pool = require('./index.cjs'); 

// List of packages that have already been delivered or cancelled after being at the post office for too long
router.post('/package-history', async (req, res) => { 
    const { userID } = req.body

    if (!userID) {
        return res.status(400).json({ message: 'User is not logged in.' });
    }

    try {
        const result = await pool.request()
            .input('userID', sql.Int, userID)
            .query(`
                SELECT P.trackingNumber, S.state as status, P.packageContent, S.timeOfStatus
                FROM trackinginfo as T, statuses as S, package as P
                WHERE (T.senderUID = @userID OR T.receiverUID = @userID) AND P.trackingNumber = T.trackingNumber
                        AND S.SID = T.currentStatus AND (S.state = 'Delivered' OR S.state = 'Cancelled') AND P.isDeleted = 0;
            `);
        res.json(result.recordset);
    } catch (error) {
        console.error('Error fetching package history:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }    
});

// The same thing but now it's not Delivered or Cancelled packages
router.post('/package-status', async (req, res) => { 
    const { userID } = req.body

    if (!userID) {
        return res.status(400).json({ message: 'User is not logged in.' });
    }

    try {
        const result = await pool.request() // Trying to optimize this
            .input('userID', sql.Int, userID)
            .query(`
                SELECT 
                    P.trackingNumber, 
                    S.state AS status, 
                    S.timeOfStatus, 
                    A1.city AS currentCity, 
                    A1.state AS currentState, 
                    A2.city AS nextCity, 
                    A2.state AS nextState
                FROM 
                    trackinginfo AS T
                JOIN 
                    package AS P ON P.trackingNumber = T.trackingNumber
                JOIN 
                    statuses AS S ON S.SID = T.currentStatus
                LEFT JOIN 
                    office AS currOffice ON S.currOID = currOffice.OID
                LEFT JOIN 
                    office AS nextOffice ON S.nextOID = nextOffice.OID
                LEFT JOIN 
                    addresses AS A1 ON currOffice.officeAddress = A1.addressID
                LEFT JOIN 
                    addresses AS A2 ON nextOffice.officeAddress = A2.addressID
                WHERE 
                    (T.senderUID = @userID OR T.receiverUID = @userID)
                    AND (S.state <> 'Delivered' AND S.state <> 'Cancelled')
                    AND P.isDeleted = 0;
            `);
        res.json(result.recordset);
    } catch (error) {
        console.error('Error fetching package status:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }    
});


// Returns what's in the package, the sender location and receiver location (full address)
router.post('/package-info', async (req, res) => { 
    const { trackingNumber } = req.body

    if (!trackingNumber) {
        return res.status(400).json({ message: 'Invalid tracking number.' });
    }

    try {
        // I couldn't figure out a cleaner way to do this part
        const result = await pool.request()
            .input('trackingNumber', sql.Int, trackingNumber)
            .query(` 
                SELECT senderAddress.streetAddress AS senderStreet, 
                        senderAddress.city AS senderCity,
                        senderAddress.state AS senderState,
                        senderAddress.zipcode AS senderZip,
                        senderAddress.country AS senderCountry,
                        receiverAddress.streetAddress AS receiverStreet, 
                        receiverAddress.city AS receiverCity,
                        receiverAddress.state AS receiverState,
                        receiverAddress.zipcode AS receiverZip,
                        receiverAddress.country AS receiverCountry,
                        senderName.firstName AS senderFirstName,
                        senderName.middleInitial AS senderMI,
                        senderName.lastName AS senderLastName,
                        receiverName.firstName AS receiverFirstName,
                        receiverName.middleInitial AS receiverMI,
                        receiverName.lastName AS receiverLastName,
                        package.packageContent,
                        package.isDelivery,
                        package.isFragile,
                        package.specialInstructions,
                        trackinginfo.expectedDelivery,
                        dpr.type
                FROM trackinginfo
                JOIN package ON package.trackingNumber = trackinginfo.trackingNumber
                JOIN addresses AS senderAddress ON trackinginfo.senderAddress = senderAddress.addressID
                JOIN addresses AS receiverAddress ON trackinginfo.receiverAddress = receiverAddress.addressID
                JOIN names AS senderName ON trackinginfo.senderName = senderName.nameID
                JOIN names AS receiverName ON trackinginfo.receiverName = receiverName.nameID
                JOIN deliveryprio AS dpr ON dpr.deliveryPrio = package.deliveryPriority
                WHERE trackinginfo.trackingNumber = @trackingNumber;
            `);

        res.json(result.recordset);
    } catch (error) {
        console.error('Error fetching package info:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }    
});

// "Add" package to user's statuses or history by updating senderUID or receiverUID
router.post('/add-package', async (req, res) => { 
    let { trackingNumber, role, userID } = req.body
    userID = parseInt(userID, 10);

    if (!trackingNumber || !role) {
        return res.status(400).json({ message: 'Nothing was entered.' });
    }

    if(!userID){
        return res.status(400).json({ message: 'User not logged in.' });
    }


    try {
        // Checks to make sure sender and receiver aren't the same
        const result = await pool.request()
            .input('trackingNumber', sql.Int, trackingNumber)
            .query('SELECT senderUID, receiverUID FROM trackinginfo WHERE trackingNumber = @trackingNumber');
        
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: 'Tracking number not found.' });
        }

        const currentSenderUID = result.recordset[0].senderUID;
        const currentReceiverUID = result.recordset[0].receiverUID;

        if (role === 'sender' && userID === currentReceiverUID) {
            return res.status(400).json({ message: 'Sender and receiver cannot be the same.' });
        } else if (role === 'receiver' && userID === currentSenderUID) {
            return res.status(400).json({ message: 'Sender and receiver cannot be the same.' });
        }

        if(role === 'sender'){
            try {

                await pool.request()
                    .input('trackingNumber', sql.Int, trackingNumber)
                    .input('userID', sql.Int, userID)
                    .query(` 
                        UPDATE trackinginfo
                        SET senderUID = @userID
                        WHERE trackingNumber = @trackingNumber;
                    `);
                res.json({ success: true });
            } catch (error) {
                console.error('Error updating sender UID:', error.message);
                res.status(500).json({ message: 'Internal Server Error' });
            }  
        }else if(role === 'receiver'){

            await pool.request()
                    .input('trackingNumber', sql.Int, trackingNumber)
                    .input('userID', sql.Int, userID)
                    .query(` 
                        UPDATE trackinginfo
                        SET receiverUID = @userID
                        WHERE trackingNumber = @trackingNumber;
                    `);
            res.json({ success: true });
        }else{
            return res.status(400).json({ message: 'Invalid role.' });
        }
        
    } catch (error) {
        console.error('Error adding package info:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }    
});

// Getting customer info the moment they load into the profile page
router.post('/customer-info', async (req, res) => { 
    const { userID } = req.body

    if(!userID){
        return res.status(400).json({ message: 'User not logged in.' });
    }

    try {
        
        const result = await pool.request()
            .input('userID', sql.Int, userID)
            .query(` 
                SELECT firstName, middleInitial, lastName, streetAddress, city, state, zipcode, country, password, phoneNumber, email
                FROM customer
                JOIN names ON name = nameID
                JOIN addresses on address = addressID
                WHERE UID = @userID;
            `);
        
        res.json(result.recordset[0]);
    } catch (error) {
        console.error('Error fetching package info:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }    
});

router.post('/business-info', async (req, res) => { 
    const { userID } = req.body

    if(!userID){
        return res.status(400).json({ message: 'User not logged in.' });
    }

    try {
        
        const result = await pool.request()
            .input('userID', sql.Int, userID)
            .query(` 
                SELECT firstName, middleInitial, lastName, streetAddress, city, state, zipcode, country, password, email, businessName
                FROM business
                JOIN names ON nameID = ownerName
                JOIN addresses on addressID = warehouseAddress
                WHERE UID = @userID;
            `);
        
        res.json(result.recordset[0]);
    } catch (error) {
        console.error('Error fetching package info:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }    
});

// Updating profile
router.post('/update-info', async (req, res) => { 
    const { userID, firstName, middleInitial, lastName, streetAddress, city, state, zipcode, country, password, email, phoneNumber} = req.body

    if(!userID){
        return res.status(400).json({ message: 'User not logged in.' });
    }

    try {
        const nameResult = await pool.request()
            .input('userID', sql.Int, userID)
            .query(`
                SELECT name 
                FROM customer 
                WHERE UID = @userID;
            `);

        const nameID = nameResult.recordset[0].name;

        const addressResult = await pool.request()
            .input('userID', sql.Int, userID)
            .query(`
                SELECT address 
                FROM customer 
                WHERE UID = @userID;
            `);

        const addressID = addressResult.recordset[0].address;

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
            .input('streetAddress', sql.VarChar, streetAddress)
            .input('city', sql.VarChar, city)
            .input('state', sql.VarChar, state)
            .input('zipcode', sql.Int, zipcode)
            .input('country', sql.VarChar, country)
            .input('addressID', sql.Int, addressID)
            .query(`
                UPDATE addresses
                SET streetAddress = @streetAddress, city = @city, state = @state, zipcode = @zipcode, country = @country
                WHERE addressID = @addressID;
            `);
        
        await pool.request()
            .input('userID', sql.Int, userID)
            .input('password', sql.VarChar, password)
            .input('phoneNumber', sql.VarChar, phoneNumber)
            .input('email', sql.VarChar, email)
            .query(`
                UPDATE customer
                SET password = @password, phoneNumber = @phoneNumber, email = @email
                WHERE UID = @userID;
            `);
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error updating user info:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }    
});

router.post('/business-profile-update', async (req, res) => { 
    const { userID, firstName, middleInitial, lastName, streetAddress, city, state, zipcode, country, password, email, businessName} = req.body

    if(!userID){
        return res.status(400).json({ message: 'User not logged in.' });
    }

    try {
        const nameResult = await pool.request()
            .input('userID', sql.Int, userID)
            .query(`
                SELECT ownerName 
                FROM business 
                WHERE UID = @userID;
            `);

        const nameID = nameResult.recordset[0].ownerName;

        const addressResult = await pool.request()
            .input('userID', sql.Int, userID)
            .query(`
                SELECT warehouseAddress 
                FROM business 
                WHERE UID = @userID;
            `);

        const addressID = addressResult.recordset[0].warehouseAddress;

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
            .input('streetAddress', sql.VarChar, streetAddress)
            .input('city', sql.VarChar, city)
            .input('state', sql.VarChar, state)
            .input('zipcode', sql.Int, zipcode)
            .input('country', sql.VarChar, country)
            .input('addressID', sql.Int, addressID)
            .query(`
                UPDATE addresses
                SET streetAddress = @streetAddress, city = @city, state = @state, zipcode = @zipcode, country = @country
                WHERE addressID = @addressID;
            `);
        
        await pool.request()
            .input('userID', sql.Int, userID)
            .input('password', sql.VarChar, password)
            .input('businessName', sql.VarChar, businessName)
            .input('email', sql.VarChar, email)
            .query(`
                UPDATE business
                SET password = @password, businessName = @businessName, email = @email, updatedAt = GETDATE()
                WHERE UID = @userID;
            `);
        
        res.json({ success: true });
    } catch (error) {
        console.error('Error updating user info:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }    
});

module.exports = router;
// ------------ASHLEY (END)-------------------------------------------------