const express = require('express');
const sql = require('mssql');
const router = express.Router();
const pool = require('./index.cjs');

// Helper function to generate random IDs for payment and package
const generateRandomID = () => {
    return Math.floor(Math.random() * 100000); //
};

// Helper function to generate a random OID between 1 and 4
const generateRandomOID = () => {
    return Math.floor(Math.random() * 4) + 1; // Random OID between 1 and 4
};

// Record a payment and create purchase record in the payments table
router.post('/payments', async (req, res) => {
    const { userID, amount, paymentMethod, cart } = req.body; // Cart is sent from frontend

    // Log inputs to check if data is coming correctly
    console.log("Received Data:", req.body);

    try {
        // Generate random paymentID, packageID, and OID
        const paymentID = generateRandomID();
        const packageID = generateRandomID();
        const OID = generateRandomOID(); // Get OID between 1 and 4
        const createdAt = new Date();
        const updatedAt = new Date();
        
        // Prepare the content (cart items as a JSON string)
        const content = JSON.stringify(cart); 

        // Log the generated query parameters
        console.log("Query Parameters:", {
            paymentID, packageID, amount, createdAt, updatedAt, OID, content
        });

        // Insert into 'payments' table
        const result = await pool.request()
    .input('amount', sql.Decimal(10, 2), amount)
    .input('createdAt', sql.DateTime, createdAt)
    .input('updatedAt', sql.DateTime, updatedAt)
    .input('OID', sql.TinyInt, OID)
    .input('content', sql.VarChar(250), content)
    .query(`
        INSERT INTO payments (amount, createdAt, updatedAt, OID, content)
        VALUES (@amount, @createdAt, @updatedAt, @OID, @content);
    `);

        // If insert is successful, log and return success response
        console.log("Payment Inserted Successfully:", result);
        res.json({
            success: true,
            message: 'Payment recorded successfully!',
            paymentID: paymentID,
            packageID: packageID
        });

    } catch (error) {
        // Log the error for debugging
        console.error('Error processing payment and creating purchase record:', error);
        res.status(500).json({ error: 'Failed to process payment and create purchase record.' });
    }
});

module.exports = router;
