const express = require('express');
const sql = require('mssql');
const router = express.Router();
const pool = require('./index.cjs');

// Fetch all admins
router.post('/get-admins', async (req, res) => {
    try {
        const result = await pool.request()
            .query(`
                SELECT AID, adminName, username, phoneNumber, email, adminCreatedAt, adminLastUpdatedAt, lastUpdatedBy
                FROM admin;
            `);
        res.json(result.recordset);
    } catch (error) {
        console.error('Error fetching admins:', error);
        res.status(500).json({ error: 'Failed to fetch admins' });
    }
});

// Add a new admin
router.post('/add-admin', async (req, res) => {
    const { adminName, username, password, phoneNumber, email, addedBy } = req.body;

    try {
        const result = await pool.request()
            .input('adminName', sql.VarChar, adminName)
            .input('username', sql.VarChar, username)
            .input('password', sql.VarChar, password)
            .input('phoneNumber', sql.VarChar, phoneNumber)
            .input('email', sql.VarChar, email)
            .input('addedBy', sql.Int, addedBy)
            .query(`
                INSERT INTO admin (adminName, username, password, phoneNumber, email, adminCreatedAt, lastUpdatedBy)
                VALUES (@adminName, @username, @password, @phoneNumber, @email, GETDATE(), @addedBy);
                SELECT SCOPE_IDENTITY() AS newAdminID;
            `);

        res.json({ success: true, newAdminID: result.recordset[0].newAdminID });
    } catch (error) {
        console.error('Error adding admin:', error);
        res.status(500).json({ error: 'Failed to add admin' });
    }
});

// Update an admin
router.post('/update-admin', async (req, res) => {
    const { AID, adminName, username, password, phoneNumber, email, updatedBy } = req.body;

    try {
        await pool.request()
            .input('AID', sql.Int, AID)
            .input('adminName', sql.VarChar, adminName)
            .input('username', sql.VarChar, username)
            .input('password', sql.VarChar, password)
            .input('phoneNumber', sql.VarChar, phoneNumber)
            .input('email', sql.VarChar, email)
            .input('updatedBy', sql.Int, updatedBy)
            .query(`
                UPDATE admin
                SET 
                    adminName = @adminName,
                    username = @username,
                    password = @password,
                    phoneNumber = @phoneNumber,
                    email = @email,
                    adminLastUpdatedAt = GETDATE(),
                    lastUpdatedBy = @updatedBy
                WHERE AID = @AID;
            `);

        res.json({ success: true });
    } catch (error) {
        console.error('Error updating admin:', error);
        res.status(500).json({ error: 'Failed to update admin' });
    }
});

// Delete (soft delete) an admin
router.post('/delete-admin', async (req, res) => {
    const { AID, updatedBy } = req.body;

    try {
        await pool.request()
            .input('AID', sql.Int, AID)
            .input('updatedBy', sql.Int, updatedBy)
            .query(`
                UPDATE admin
                SET adminLastUpdatedAt = GETDATE(), lastUpdatedBy = @updatedBy
                WHERE AID = @AID AND AID != @updatedBy; -- Prevents self-deletion
            `);

        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting admin:', error);
        res.status(500).json({ error: 'Failed to delete admin' });
    }
});

module.exports = router;
