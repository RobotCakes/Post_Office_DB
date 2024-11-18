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
                SELECT firstName, middleInitial, lastName, EID, email, isDeleted
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
        console.log(req.body);
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
    const { userID, userRole, firstName, lastName, middleInitial, email, username, pwd } =  req.body;
    try {
        console.log(req.body);

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

        const manager = await pool.request().input('userID', sql.Int, userID)
            .query(`
                SELECT OID
                FROM employee 
                WHERE EID = @userID;`);
        
        const managerOID = manager.recordset[0].OID;

        const result = await pool.request()
            .input('nameID', sql.Int, nameID)
            .input('userID', sql.Int, userID)
            .input('userRole', sql.VarChar, userRole)
            .input('email', sql.VarChar, email)
            .input('username', sql.VarChar, username)
            .input('pwd', sql.VarChar, pwd)
            .input('managerOID', sql.TinyInt, managerOID)
            .query(`
                INSERT INTO employee (employeeName, username, password, isManager, email, employeeStartDate, employeeCreatedOn, employeeCreatedBy, userTypeCreate, OID) 
                VALUES (@nameID, @username, @pwd, 0, @email, GETDATE(), GETDATE(), @userID, @userRole, @managerOID); 
                SELECT SCOPE_IDENTITY() AS name_id;
            `);


        res.json( {success: true});
    } catch (error) {
        console.error('Error fetching employee list:', error);
        res.status(500).json({ error: 'Failed to fetch employees info' });
    }
});

module.exports = router;