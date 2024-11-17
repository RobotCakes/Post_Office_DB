const express = require('express');
const sql = require('mssql');
const router = express.Router();
const pool = require('./index.cjs');

// Record a payment
router.post('/payments', async (req, res) => {
    const { userID, amount, paymentMethod } = req.body;
    try {
        const result = await pool.request()
            .input('userID', sql.Int, userID)
            .input('amount', sql.Float, amount)
            .input('paymentMethod', sql.VarChar, paymentMethod)
            .input('date', sql.DateTime, new Date())
            .query(`
                INSERT INTO payments (userID, amount, paymentMethod, date)
                VALUES (@userID, @amount, @paymentMethod, @date);
            `);
        res.json({ success: true, paymentID: result.recordset.insertId });
    } catch (error) {
        console.error('Error processing payment:', error);
        res.status(500).json({ error: 'Failed to process payment' });
    }
});

module.exports = router;
