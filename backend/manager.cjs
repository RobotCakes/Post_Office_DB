//---------------------ASHLEY
const express = require('express');
const sql = require('mssql');
const router = express.Router();
const pool = require('./index.cjs');

router.post('/get-employees', async (req, res) => {
    const {userID} =  req.body;
    try {

        const manager = await pool.request().input('userID', sql.Int, userID)
            .query(`
                SELECT OID
                FROM employee 
                WHERE EID = @userID;`);
        
        const managerOID = manager.recordset[0].OID;

        const result = await pool.request()
            .input('userID', sql.Int, userID)
            .input('managerOID', sql.TinyInt, managerOID)
            .query(`
                SELECT firstName, middleInitial, lastName, EID, email, isDeleted, username, password
                FROM employee 
                JOIN names ON nameID = employeeName
                WHERE OID = @managerOID`);

        res.json(result.recordset);
    } catch (error) {
        console.error('Error fetching employee list:', error);
        res.status(500).json({ error: 'Failed to fetch employees info' });
    }
});


router.post('/delete-employees', async (req, res) => {
    const { userID, userRole, EID } =  req.body;
    try {
        await pool.request()
            .input('userID', sql.Int, userID)
            .input('userRole', sql.VarChar, userRole)
            .input('EID', sql.Int, EID)
            .query(`
                UPDATE employee
                SET isDeleted = CASE WHEN isDeleted = 1 THEN 0 ELSE 1 END, lastUpdatedBy = @userID, lastUpdatedAt = GETDATE()
                WHERE EID = @EID;`);

        res.json( {success: true});
    } catch (error) {
        console.error('Error fetching employee list:', error);
        res.status(500).json({ error: 'Failed to fetch employees info' });
    }
});

router.post('/add-employee', async (req, res) => {
    const { userID, userRole, firstName, lastName, middleInitial, email, username, pwd, isManager, OID } =  req.body;
    try {
        console.log(req.body);

        const dupe = await pool.request()
            .input('username', sql.VarChar, username)
            .query(`
                SELECT AID AS ID FROM admin WHERE username = @username
                UNION
                SELECT EID AS ID FROM employee WHERE username = @username AND isDeleted = 0
                UNION
                SELECT UID AS ID FROM customer WHERE username = @username
                UNION
                SELECT UID AS ID FROM business WHERE username = @username
            `);
        
        if (dupe.recordset.length > 0) {
            console.log('Username exists elsewhere.');
            return res.status(400).json({ success: false, message: 'Username already exists.' });
        }
        

        const nameResult = await pool.request()
            .input('firstName', sql.VarChar, firstName)
            .input('lastName', sql.VarChar, lastName)
            .input('middleInitial', sql.VarChar, middleInitial)
            .query(`
                INSERT INTO names (firstName, middleInitial, lastName) 
                VALUES (@firstName, @middleInitial, @lastName); 
                SELECT SCOPE_IDENTITY() AS name_id;
            `);

        const nameID = nameResult.recordset[0].name_id;

        const result = await pool.request()
            .input('nameID', sql.Int, nameID)
            .input('userID', sql.Int, userID)
            .input('userRole', sql.VarChar, userRole)
            .input('email', sql.VarChar, email)
            .input('username', sql.VarChar, username)
            .input('pwd', sql.VarChar, pwd)
            .input('managerOID', sql.TinyInt, OID)
            .input('isManager', sql.Bit, isManager)
            .query(`
                INSERT INTO employee (employeeName, username, password, isManager, email, employeeStartDate, employeeCreatedOn, employeeCreatedBy, userTypeCreate, OID) 
                VALUES (@nameID, @username, @pwd, @isManager, @email, GETDATE(), GETDATE(), @userID, @userRole, @managerOID); 
                SELECT SCOPE_IDENTITY() AS name_id;
            `);


        res.json( {success: true});
    } catch (error) {
        console.error('Error fetching employee list:', error);
        res.status(500).json({ error: 'Failed to fetch employees info' });
    }
});


router.post('/get-supplies', async (req, res) => {
    try {

        const result = await pool.request()
            .query(`
                SELECT supplies.OID, supplies.name, supplies.quantity, supplies.pricePerUnit, city, supplies.isDeleted, supplyID
                FROM supplies 
                LEFT JOIN office ON office.OID = supplies.OID 
                LEFT JOIN addresses ON office.officeAddress = addressID;
            `);
    

        res.json(result.recordset);
    } catch (error) {
        console.error('Error fetching supplies:', error);
        res.status(500).json({ error: 'Failed to fetch supplies.' });
    }
});

router.post('/delete-supplies', async (req, res) => {
    const { id, userID } =  req.body;

    try {
        await pool.request()
            .input('id', sql.Int, id)
            .input('userID', sql.Int, userID)
            .query(`
                UPDATE supplies
                SET isDeleted = CASE WHEN isDeleted = 1 THEN 0 ELSE 1 END, lastUpdatedAt = GETDATE(), updatedBy = @userID
                WHERE supplyID = @id;
            `);
    
        
        res.json( {success: true});
    } catch (error) {
        console.error('Error deleting supplies:', error);
        res.status(500).json({ error: 'Failed to delete supplies.' });
    }
});

router.post('/add-supplies', async (req,res) => {
    const { name, price, quantity, OID, userID } = req.body;

    try {
        const result = await pool.request()
            .input('userID', sql.Int, userID)
            .input('name', sql.VarChar, name)
            .input('price', sql.Float, price)
            .input('quantity', sql.Int, quantity)
            .input('OID', sql.TinyInt, OID)
            .query(`
                INSERT INTO supplies (name, OID, quantity, pricePerUnit, dateadded, addedBy)
                VALUES (@name, @OID, @quantity, @price, GETDATE(), @userID)
            `);
    
        
        res.json( {success: true});
    } catch (error) {
        console.error('Error deleting supplies:', error);
        res.status(500).json({ error: 'Failed to delete supplies.' });
    }
});

router.post('/restock-supplies', async (req, res) => {
    const { updatedQuantity, userID, id } =  req.body;

    try {
        await pool.request()
            .input('id', sql.Int, id)
            .input('userID', sql.Int, userID)
            .input('quantity', sql.Int, updatedQuantity)
            .query(`
                UPDATE supplies
                SET quantity = @quantity, lastUpdatedAt = @userID
                WHERE supplyID = @id;
            `);
    
        
        res.json( {success: true});
    } catch (error) {
        console.error('Error deleting supplies:', error);
        res.status(500).json({ error: 'Failed to delete supplies.' });
    }
});


module.exports = router;