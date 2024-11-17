const express = require('express');
const sql = require('mssql');
const router = express.Router();
const pool = require('./index.cjs'); 

// Get all supplies
router.get('/supplies', async (req, res) => {
    try {
        const result = await pool.request().query('SELECT * FROM supplies;');
        res.json(result.recordset);
    } catch (error) {
        console.error('Error fetching supplies:', error);
        res.status(500).json({ error: 'Failed to fetch supplies' });
    }
});

// Update supply quantity
router.put('/supplies/:id', async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;
    try {
        const result = await pool.request()
            .input('supplyID', sql.Int, id)
            .input('name', sql.NVarChar, name)
            .input('quantity', sql.Int, quantity)
            .input('pricePerUnit', sql.Decimal, pricePerUnit)
            .input('description', sql.NVarChar, description)
            .query(`
                UPDATE supplies 
                SET 
                    quantity = @quantity,
                    pricePerUnit = @pricePerUnit,
                    lastUpdatedAt = @lastUpdatedAt,
                    updatedBy = @updatedBy
                WHERE supplyID = @supplyID;
            `);
        res.json({ success: true, rowsAffected: result.rowsAffected });
    } catch (error) {
        console.error('Error updating supply:', error);
        res.status(500).json({ error: 'Failed to update supply' });
    }
});

module.exports = router;
