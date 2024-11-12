const express = require('express');
const sql = require('mssql');
const router = express.Router();
const pool = require('./index.cjs'); 

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
                        AND S.SID = T.currentStatus AND (S.state = 'Delivered' OR S.state = 'Cancelled');
            `);
        res.json(result.recordset);
    } catch (error) {
        console.error('Error fetching package history:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
        
});


module.exports = router;