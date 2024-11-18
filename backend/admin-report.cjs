const express = require("express");
const sql = require("mssql");
const router = express.Router();
const pool = require("./index.cjs");

router.get("/AdminIncomeBasedOnPayment", async (req, res) => {
  const { userID } = req.body;
  const { timeframe } = req.timeframe;

  if (!userID) {
    return res.status(400).json({ message: "User is not logged in." });
  }
  let query;
  let query2;

  switch (timeframe) {
    case "daily":
      query = `
            SELECT 
                o.OID, 
                SUM(p.payments) AS TotalIncome 
            FROM 
                dbo.payments p
            INNER JOIN 
                dbo.office o ON p.OID = o.OID
            WHERE 
                p.updatedAt >= DATEADD(hour, -24, GETDATE())
            GROUP BY 
                o.OID;
        `;
      query2 = `
            SELECT 
                p.paymentID, 
                p.packageID, 
                p.amount, 
                p.content, 
                o.name AS OfficeName, 
                s.timeOfStatus, 
                s.currOID
            FROM 
                dbo.payments p
            INNER JOIN 
                dbo.office o ON p.OID = o.OID
            INNER JOIN 
                dbo.statuses s ON p.packageID = s.PID
            WHERE 
                p.updatedAt >= DATEADD(hour, -24, GETDATE())
            ORDER BY 
                s.currOID;
        `;
      break;
    case "weekly":
      query = `
            SELECT 
                o.OID, 
                SUM(p.payments) AS TotalIncome 
            FROM 
                dbo.payments p
            INNER JOIN 
                dbo.office o ON p.OID = o.OID
            WHERE 
                p.updatedAt >= DATEADD(day, -7, GETDATE())
            GROUP BY 
                o.OID;
        `;
      query2 = `
            SELECT 
                p.paymentID, 
                p.packageID, 
                p.amount, 
                p.content, 
                o.name AS OfficeName, 
                s.timeOfStatus, 
                s.currOID
            FROM 
                dbo.payments p
            INNER JOIN 
                dbo.office o ON p.OID = o.OID
            INNER JOIN 
                dbo.statuses s ON p.packageID = s.PID
            WHERE 
                p.updatedAt >= DATEADD(day, -7, GETDATE())
            ORDER BY 
                s.currOID;
        `;
      break;
    case "monthly":
      query = `
            SELECT 
                o.OID, 
                SUM(p.payments) AS TotalIncome 
            FROM 
                dbo.payments p
            INNER JOIN 
                dbo.office o ON p.OID = o.OID
            WHERE 
                p.updatedAt >= DATEADD(day, -30, GETDATE())
            GROUP BY 
                o.OID;
        `;
      query2 = `
        SELECT 
            p.paymentID, 
            p.packageID, 
            p.amount, 
            p.content, 
            o.name AS OfficeName, 
            s.timeOfStatus, 
            s.currOID
        FROM 
            dbo.payments p
        INNER JOIN 
            dbo.office o ON p.OID = o.OID
        INNER JOIN 
            dbo.statuses s ON p.packageID = s.PID
        WHERE 
            p.updatedAt >= DATEADD(day, -30, GETDATE())
        ORDER BY 
            s.currOID;
        `;
      break;
    case "yearly":
      query = `
            SELECT 
                o.OID, 
                SUM(p.payments) AS TotalIncome 
            FROM 
                dbo.payments p
            INNER JOIN 
                dbo.office o ON p.OID = o.OID
            WHERE 
                p.updatedAt >= DATEADD(day, -365, GETDATE())
            GROUP BY 
                o.OID;
        `;
      query2 = `
            SELECT 
                p.paymentID, 
                p.packageID, 
                p.amount, 
                p.content, 
                o.name AS OfficeName, 
                s.timeOfStatus, 
                s.currOID
            FROM 
                dbo.payments p
            INNER JOIN 
                dbo.office o ON p.OID = o.OID
            INNER JOIN 
                dbo.statuses s ON p.packageID = s.PID
            WHERE 
                p.updatedAt >= DATEADD(day, -365, GETDATE())
            ORDER BY 
                s.currOID;
            `;
      break;
    case "alltime":
      query = `
            SELECT 
                o.OID, 
                SUM(p.payments) AS TotalIncome 
            FROM 
                dbo.payments p
            INNER JOIN 
                dbo.office o ON p.OID = o.OID
            GROUP BY 
                o.OID;
        `;
      query2 = `
        SELECT 
            p.paymentID, 
            p.packageID, 
            p.amount, 
            p.content, 
            o.name AS OfficeName, 
            s.timeOfStatus, 
            s.currOID
        FROM 
            dbo.payments p
        INNER JOIN 
            dbo.office o ON p.OID = o.OID
        INNER JOIN 
            dbo.statuses s ON p.packageID = s.PID
        ORDER BY 
            s.currOID;
        `;
      break;
    default:
      throw new Error("Invalid timeframe");
  }
  try {
    const result1 = await pool
      .request()
      .input("userID", sql.Int, userID)
      .query(query);
    const result2 = await pool
      .request()
      .input("userID", sql.Int, userID)
      .query(query2);
    const results = {
      sum: result1.recordset,
      tuples: result2.recordset,
    };
    res.json(results);
  } catch (error) {
    console.error("Error fetching Incomes:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
/*************************************************************************************/
/*************************************************************************************/
router.get("/AdminIncomeBasedOnPackage", async (req, res) => {
  const { userID } = req.body;
  const { timeframe } = req.timeframe;

  if (!userID) {
    return res.status(400).json({ message: "User is not logged in." });
  }
  let query;
  let query2;

  switch (timeframe) {
    case "daily":
      query = `
        SELECT 
            o.name, 
            SUM(p.deliverPrice) AS totalDeliveryPrice
        FROM 
            dbo.package p
        JOIN 
            dbo.trackingInfo ti ON p.trackingNumber = ti.trackingNumber
        JOIN 
            dbo.statuses s ON s.PID = p.PID AND s.trackingNumber = ti.trackingNumber
        JOIN 
            dbo.office o ON o.OID = s.currOID
        WHERE 
            s.timeOfStatus = (
                SELECT MIN(sub_s.timeOfStatus)
                FROM dbo.statuses sub_s
                WHERE sub_s.PID = s.PID AND sub_s.trackingNumber = s.trackingNumber
            )
            AND s.timeOfStatus >= DATEADD(hour, -24, GETDATE())
        GROUP BY 
            o.OID, o.name
        ORDER BY 
            o.OID ASC;
    `;
      query2 = `
            SELECT 
                package.PID,
                trackingInfo.trackingNumber,
                package.deliverPrice,
                office.name,
                statuses.updatedBy
            FROM 
                dbo.package
            JOIN 
                dbo.trackingInfo ON package.trackingNumber = trackingInfo.trackingNumber
            JOIN 
                dbo.statuses ON statuses.trackingNumber = trackingInfo.trackingNumber 
                            AND statuses.PID = package.PID
            JOIN 
                dbo.office ON office.OID = statuses.currOID
            WHERE 
                statuses.timeOfStatus = (
                    SELECT MIN(timeOfStatus)
                    FROM dbo.statuses
                    WHERE statuses.PID = package.PID 
                    AND statuses.trackingNumber = trackingInfo.trackingNumber
                )
                AND statuses.timeOfStatus >= DATEADD(hour, -24, GETDATE())
            ORDER BY 
                statuses.currOID ASC;
        `;
      break;
    case "weekly":
      query = `
            SELECT 
                o.name, 
                SUM(p.deliverPrice) AS totalDeliveryPrice
            FROM 
                dbo.package p
            JOIN 
                dbo.trackingInfo ti ON p.trackingNumber = ti.trackingNumber
            JOIN 
                dbo.statuses s ON s.PID = p.PID AND s.trackingNumber = ti.trackingNumber
            JOIN 
                dbo.office o ON o.OID = s.currOID
            WHERE 
                s.timeOfStatus = (
                    SELECT MIN(sub_s.timeOfStatus)
                    FROM dbo.statuses sub_s
                    WHERE sub_s.PID = s.PID AND sub_s.trackingNumber = s.trackingNumber
                )
                AND s.timeOfStatus >= DATEADD(day, -7, GETDATE())
            GROUP BY 
                o.OID, o.name
            ORDER BY 
                o.OID ASC;
            `;
      query2 = `
            SELECT 
                package.PID,
                trackingInfo.trackingNumber,
                package.deliverPrice,
                office.name,
                statuses.updatedBy
            FROM 
                dbo.package
            JOIN 
                dbo.trackingInfo ON package.trackingNumber = trackingInfo.trackingNumber
            JOIN 
                dbo.statuses ON statuses.trackingNumber = trackingInfo.trackingNumber 
                            AND statuses.PID = package.PID
            JOIN 
                dbo.office ON office.OID = statuses.currOID
            WHERE 
                statuses.timeOfStatus = (
                    SELECT MIN(timeOfStatus)
                    FROM dbo.statuses
                    WHERE statuses.PID = package.PID 
                    AND statuses.trackingNumber = trackingInfo.trackingNumber
                )
                AND statuses.timeOfStatus >= DATEADD(day, -7, GETDATE())
            ORDER BY 
                statuses.currOID ASC;
            `;
      break;
    case "monthly":
      query = `
            SELECT 
                o.name, 
                SUM(p.deliverPrice) AS totalDeliveryPrice
            FROM 
                dbo.package p
            JOIN 
                dbo.trackingInfo ti ON p.trackingNumber = ti.trackingNumber
            JOIN 
                dbo.statuses s ON s.PID = p.PID AND s.trackingNumber = ti.trackingNumber
            JOIN 
                dbo.office o ON o.OID = s.currOID
            WHERE 
                s.timeOfStatus = (
                    SELECT MIN(sub_s.timeOfStatus)
                    FROM dbo.statuses sub_s
                    WHERE sub_s.PID = s.PID AND sub_s.trackingNumber = s.trackingNumber
                )
                AND s.timeOfStatus >= DATEADD(day, -30, GETDATE())
            GROUP BY 
                o.OID, o.name
            ORDER BY 
                o.OID ASC;
            `;
      query2 = `
            SELECT 
                package.PID,
                trackingInfo.trackingNumber,
                package.deliverPrice,
                office.name,
                statuses.updatedBy
            FROM 
                dbo.package
            JOIN 
                dbo.trackingInfo ON package.trackingNumber = trackingInfo.trackingNumber
            JOIN 
                dbo.statuses ON statuses.trackingNumber = trackingInfo.trackingNumber 
                            AND statuses.PID = package.PID
            JOIN 
                dbo.office ON office.OID = statuses.currOID
            WHERE 
                statuses.timeOfStatus = (
                    SELECT MIN(timeOfStatus)
                    FROM dbo.statuses
                    WHERE statuses.PID = package.PID 
                    AND statuses.trackingNumber = trackingInfo.trackingNumber
                )
                AND statuses.timeOfStatus >= DATEADD(day, -30, GETDATE())
            ORDER BY 
                statuses.currOID ASC;
            `;
      break;
    case "yearly":
      query = `
            SELECT 
                o.name, 
                SUM(p.deliverPrice) AS totalDeliveryPrice
            FROM 
                dbo.package p
            JOIN 
                dbo.trackingInfo ti ON p.trackingNumber = ti.trackingNumber
            JOIN 
                dbo.statuses s ON s.PID = p.PID AND s.trackingNumber = ti.trackingNumber
            JOIN 
                dbo.office o ON o.OID = s.currOID
            WHERE 
                s.timeOfStatus = (
                    SELECT MIN(sub_s.timeOfStatus)
                    FROM dbo.statuses sub_s
                    WHERE sub_s.PID = s.PID AND sub_s.trackingNumber = s.trackingNumber
                )
                AND s.timeOfStatus >= DATEADD(day, -365, GETDATE())
            GROUP BY 
                o.OID, o.name
            ORDER BY 
                o.OID ASC;
        `;
      query2 = `
            SELECT 
                package.PID,
                trackingInfo.trackingNumber,
                package.deliverPrice,
                office.name,
                statuses.updatedBy
            FROM 
                dbo.package
            JOIN 
                dbo.trackingInfo ON package.trackingNumber = trackingInfo.trackingNumber
            JOIN 
                dbo.statuses ON statuses.trackingNumber = trackingInfo.trackingNumber 
                            AND statuses.PID = package.PID
            JOIN 
                dbo.office ON office.OID = statuses.currOID
            WHERE 
                statuses.timeOfStatus = (
                    SELECT MIN(timeOfStatus)
                    FROM dbo.statuses
                    WHERE statuses.PID = package.PID 
                    AND statuses.trackingNumber = trackingInfo.trackingNumber
                )
                AND statuses.timeOfStatus >= DATEADD(day, -365, GETDATE())
            ORDER BY 
                statuses.currOID ASC;
            `;
      break;
    case "alltime":
      query = `
            SELECT 
                o.name, 
                SUM(p.deliverPrice) AS totalDeliveryPrice
            FROM 
                dbo.package p
            JOIN 
                dbo.trackingInfo ti ON p.trackingNumber = ti.trackingNumber
            JOIN 
                dbo.statuses s ON s.PID = p.PID AND s.trackingNumber = ti.trackingNumber
            JOIN 
                dbo.office o ON o.OID = s.currOID
            WHERE 
                s.timeOfStatus = (
                    SELECT MIN(sub_s.timeOfStatus)
                    FROM dbo.statuses sub_s
                    WHERE sub_s.PID = s.PID AND sub_s.trackingNumber = s.trackingNumber
                )
            GROUP BY 
                o.OID, o.name
            ORDER BY 
                o.OID ASC;
            `;
      query2 = `
            SELECT 
                package.PID,
                trackingInfo.trackingNumber,
                package.deliverPrice,
                office.name,
                statuses.updatedBy
            FROM 
                dbo.package
            JOIN 
                dbo.trackingInfo ON package.trackingNumber = trackingInfo.trackingNumber
            JOIN 
                dbo.statuses ON statuses.trackingNumber = trackingInfo.trackingNumber 
                            AND statuses.PID = package.PID
            JOIN 
                dbo.office ON office.OID = statuses.currOID
            WHERE 
                statuses.timeOfStatus = (
                    SELECT MIN(timeOfStatus)
                    FROM dbo.statuses
                    WHERE statuses.PID = package.PID 
                    AND statuses.trackingNumber = trackingInfo.trackingNumber
                )
            ORDER BY 
                statuses.currOID ASC;
            `;
      break;
    default:
      throw new Error("Invalid timeframe");
  }
  try {
    const result1 = await pool
      .request()
      .input("userID", sql.Int, userID)
      .query(query);
    const result2 = await pool
      .request()
      .input("userID", sql.Int, userID)
      .query(query2);
    const results = {
      sum: result1.recordset,
      tuples: result2.recordset,
    };
    res.json(results);
  } catch (error) {
    console.error("Error fetching Incomes:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
/*************************************************************************************/
/*************************************************************************************/
router.get("/AdminIncomeBasedOnPackage", async (req, res) => {
  const { userID } = req.body;
  const { timeframe } = req.timeframe;

  if (!userID) {
    return res.status(400).json({ message: "User is not logged in." });
  }
  let query;
  let query2;

  switch (timeframe) {
    case "daily":
      query = `
          SELECT 
              o.name, 
              SUM(p.deliverPrice) AS totalDeliveryPrice
          FROM 
              dbo.package p
          JOIN 
              dbo.trackingInfo ti ON p.trackingNumber = ti.trackingNumber
          JOIN 
              dbo.statuses s ON s.PID = p.PID AND s.trackingNumber = ti.trackingNumber
          JOIN 
              dbo.office o ON o.OID = s.currOID
          WHERE 
              s.timeOfStatus = (
                  SELECT MIN(sub_s.timeOfStatus)
                  FROM dbo.statuses sub_s
                  WHERE sub_s.PID = s.PID AND sub_s.trackingNumber = s.trackingNumber
              )
              AND s.timeOfStatus >= DATEADD(hour, -24, GETDATE())
          GROUP BY 
              o.OID, o.name
          ORDER BY 
              o.OID ASC;
      `;
      query2 = `
              SELECT 
                  package.PID,
                  trackingInfo.trackingNumber,
                  package.deliverPrice,
                  office.name,
                  statuses.updatedBy
              FROM 
                  dbo.package
              JOIN 
                  dbo.trackingInfo ON package.trackingNumber = trackingInfo.trackingNumber
              JOIN 
                  dbo.statuses ON statuses.trackingNumber = trackingInfo.trackingNumber 
                              AND statuses.PID = package.PID
              JOIN 
                  dbo.office ON office.OID = statuses.currOID
              WHERE 
                  statuses.timeOfStatus = (
                      SELECT MIN(timeOfStatus)
                      FROM dbo.statuses
                      WHERE statuses.PID = package.PID 
                      AND statuses.trackingNumber = trackingInfo.trackingNumber
                  )
                  AND statuses.timeOfStatus >= DATEADD(hour, -24, GETDATE())
              ORDER BY 
                  statuses.currOID ASC;
          `;
      break;
    case "weekly":
      query = `
              SELECT 
                  o.name, 
                  SUM(p.deliverPrice) AS totalDeliveryPrice
              FROM 
                  dbo.package p
              JOIN 
                  dbo.trackingInfo ti ON p.trackingNumber = ti.trackingNumber
              JOIN 
                  dbo.statuses s ON s.PID = p.PID AND s.trackingNumber = ti.trackingNumber
              JOIN 
                  dbo.office o ON o.OID = s.currOID
              WHERE 
                  s.timeOfStatus = (
                      SELECT MIN(sub_s.timeOfStatus)
                      FROM dbo.statuses sub_s
                      WHERE sub_s.PID = s.PID AND sub_s.trackingNumber = s.trackingNumber
                  )
                  AND s.timeOfStatus >= DATEADD(day, -7, GETDATE())
              GROUP BY 
                  o.OID, o.name
              ORDER BY 
                  o.OID ASC;
              `;
      query2 = `
              SELECT 
                  package.PID,
                  trackingInfo.trackingNumber,
                  package.deliverPrice,
                  office.name,
                  statuses.updatedBy
              FROM 
                  dbo.package
              JOIN 
                  dbo.trackingInfo ON package.trackingNumber = trackingInfo.trackingNumber
              JOIN 
                  dbo.statuses ON statuses.trackingNumber = trackingInfo.trackingNumber 
                              AND statuses.PID = package.PID
              JOIN 
                  dbo.office ON office.OID = statuses.currOID
              WHERE 
                  statuses.timeOfStatus = (
                      SELECT MIN(timeOfStatus)
                      FROM dbo.statuses
                      WHERE statuses.PID = package.PID 
                      AND statuses.trackingNumber = trackingInfo.trackingNumber
                  )
                  AND statuses.timeOfStatus >= DATEADD(day, -7, GETDATE())
              ORDER BY 
                  statuses.currOID ASC;
              `;
      break;
    case "monthly":
      query = `
              SELECT 
                  o.name, 
                  SUM(p.deliverPrice) AS totalDeliveryPrice
              FROM 
                  dbo.package p
              JOIN 
                  dbo.trackingInfo ti ON p.trackingNumber = ti.trackingNumber
              JOIN 
                  dbo.statuses s ON s.PID = p.PID AND s.trackingNumber = ti.trackingNumber
              JOIN 
                  dbo.office o ON o.OID = s.currOID
              WHERE 
                  s.timeOfStatus = (
                      SELECT MIN(sub_s.timeOfStatus)
                      FROM dbo.statuses sub_s
                      WHERE sub_s.PID = s.PID AND sub_s.trackingNumber = s.trackingNumber
                  )
                  AND s.timeOfStatus >= DATEADD(day, -30, GETDATE())
              GROUP BY 
                  o.OID, o.name
              ORDER BY 
                  o.OID ASC;
              `;
      query2 = `
              SELECT 
                  package.PID,
                  trackingInfo.trackingNumber,
                  package.deliverPrice,
                  office.name,
                  statuses.updatedBy
              FROM 
                  dbo.package
              JOIN 
                  dbo.trackingInfo ON package.trackingNumber = trackingInfo.trackingNumber
              JOIN 
                  dbo.statuses ON statuses.trackingNumber = trackingInfo.trackingNumber 
                              AND statuses.PID = package.PID
              JOIN 
                  dbo.office ON office.OID = statuses.currOID
              WHERE 
                  statuses.timeOfStatus = (
                      SELECT MIN(timeOfStatus)
                      FROM dbo.statuses
                      WHERE statuses.PID = package.PID 
                      AND statuses.trackingNumber = trackingInfo.trackingNumber
                  )
                  AND statuses.timeOfStatus >= DATEADD(day, -30, GETDATE())
              ORDER BY 
                  statuses.currOID ASC;
              `;
      break;
    case "yearly":
      query = `
              SELECT 
                  o.name, 
                  SUM(p.deliverPrice) AS totalDeliveryPrice
              FROM 
                  dbo.package p
              JOIN 
                  dbo.trackingInfo ti ON p.trackingNumber = ti.trackingNumber
              JOIN 
                  dbo.statuses s ON s.PID = p.PID AND s.trackingNumber = ti.trackingNumber
              JOIN 
                  dbo.office o ON o.OID = s.currOID
              WHERE 
                  s.timeOfStatus = (
                      SELECT MIN(sub_s.timeOfStatus)
                      FROM dbo.statuses sub_s
                      WHERE sub_s.PID = s.PID AND sub_s.trackingNumber = s.trackingNumber
                  )
                  AND s.timeOfStatus >= DATEADD(day, -365, GETDATE())
              GROUP BY 
                  o.OID, o.name
              ORDER BY 
                  o.OID ASC;
          `;
      query2 = `
              SELECT 
                  package.PID,
                  trackingInfo.trackingNumber,
                  package.deliverPrice,
                  office.name,
                  statuses.updatedBy
              FROM 
                  dbo.package
              JOIN 
                  dbo.trackingInfo ON package.trackingNumber = trackingInfo.trackingNumber
              JOIN 
                  dbo.statuses ON statuses.trackingNumber = trackingInfo.trackingNumber 
                              AND statuses.PID = package.PID
              JOIN 
                  dbo.office ON office.OID = statuses.currOID
              WHERE 
                  statuses.timeOfStatus = (
                      SELECT MIN(timeOfStatus)
                      FROM dbo.statuses
                      WHERE statuses.PID = package.PID 
                      AND statuses.trackingNumber = trackingInfo.trackingNumber
                  )
                  AND statuses.timeOfStatus >= DATEADD(day, -365, GETDATE())
              ORDER BY 
                  statuses.currOID ASC;
              `;
      break;
    case "alltime":
      query = `
              SELECT 
                  o.name, 
                  SUM(p.deliverPrice) AS totalDeliveryPrice
              FROM 
                  dbo.package p
              JOIN 
                  dbo.trackingInfo ti ON p.trackingNumber = ti.trackingNumber
              JOIN 
                  dbo.statuses s ON s.PID = p.PID AND s.trackingNumber = ti.trackingNumber
              JOIN 
                  dbo.office o ON o.OID = s.currOID
              WHERE 
                  s.timeOfStatus = (
                      SELECT MIN(sub_s.timeOfStatus)
                      FROM dbo.statuses sub_s
                      WHERE sub_s.PID = s.PID AND sub_s.trackingNumber = s.trackingNumber
                  )
              GROUP BY 
                  o.OID, o.name
              ORDER BY 
                  o.OID ASC;
              `;
      query2 = `
              SELECT 
                  package.PID,
                  trackingInfo.trackingNumber,
                  package.deliverPrice,
                  office.name,
                  statuses.updatedBy
              FROM 
                  dbo.package
              JOIN 
                  dbo.trackingInfo ON package.trackingNumber = trackingInfo.trackingNumber
              JOIN 
                  dbo.statuses ON statuses.trackingNumber = trackingInfo.trackingNumber 
                              AND statuses.PID = package.PID
              JOIN 
                  dbo.office ON office.OID = statuses.currOID
              WHERE 
                  statuses.timeOfStatus = (
                      SELECT MIN(timeOfStatus)
                      FROM dbo.statuses
                      WHERE statuses.PID = package.PID 
                      AND statuses.trackingNumber = trackingInfo.trackingNumber
                  )
              ORDER BY 
                  statuses.currOID ASC;
              `;
      break;
    default:
      throw new Error("Invalid timeframe");
  }
  try {
    const result1 = await pool
      .request()
      .input("userID", sql.Int, userID)
      .query(query);
    const result2 = await pool
      .request()
      .input("userID", sql.Int, userID)
      .query(query2);
    const results = {
      sum: result1.recordset,
      tuples: result2.recordset,
    };
    res.json(results);
  } catch (error) {
    console.error("Error fetching Incomes:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
/*************************************************************************************/
/*************************************************************************************/
router.get("/AdminTotalSuppliesSold", async (req, res) => {
  const { userID } = req.body;
  const { timeframe } = req.timeframe;

  if (!userID) {
    return res.status(400).json({ message: "User is not logged in." });
  }
  let query;
  let query2;

  switch (timeframe) {
    case "daily":
      query = `
        SELECT 
            o.OID, 
            SUM(p.amount) AS Total_Supplies_Sold
        FROM 
            dbo.payments p
        INNER JOIN 
            dbo.office o ON p.OID = o.OID
        WHERE 
            p.updatedAt >= DATEADD(hour, -24, GETDATE())
        GROUP BY 
            o.OID;
    `;
      query2 = `
    SELECT 
        o.OID, 
        SUM(p.amount) AS Total_Supplies_Sold
    FROM 
        dbo.payments p
    INNER JOIN 
        dbo.office o ON p.OID = o.OID
    WHERE 
        p.updatedAt >= DATEADD(hour, -24, GETDATE())
    GROUP BY 
        o.OID;
`;
      break;
    case "weekly":
      query = `
        SELECT 
            o.OID, 
            SUM(p.amount) AS Total_Supplies_Sold 
        FROM 
            dbo.payments p
        INNER JOIN 
            dbo.office o ON p.OID = o.OID
        WHERE 
            p.updatedAt >= DATEADD(day, -7, GETDATE())
        GROUP BY 
            o.OID;
    `;
      query2 = `
    SELECT 
        o.OID, 
        SUM(p.amount) AS Total_Supplies_Sold 
    FROM 
        dbo.payments p
    INNER JOIN 
        dbo.office o ON p.OID = o.OID
    WHERE 
        p.updatedAt >= DATEADD(day, -7, GETDATE())
    GROUP BY 
        o.OID;
`;
      break;
    case "monthly":
      query = `
        SELECT 
            o.OID, 
            SUM(p.amount) AS Total_Supplies_Sold
        FROM 
            dbo.payments p
        INNER JOIN 
            dbo.office o ON p.OID = o.OID
        WHERE 
            p.updatedAt >= DATEADD(day, -30, GETDATE())
        GROUP BY 
            o.OID;
    `;
      query2 = `
    SELECT 
        o.OID, 
        SUM(p.amount) AS Total_Supplies_Sold
    FROM 
        dbo.payments p
    INNER JOIN 
        dbo.office o ON p.OID = o.OID
    WHERE 
        p.updatedAt >= DATEADD(day, -30, GETDATE())
    GROUP BY 
        o.OID;
`;
      break;
    case "yearly":
      query = `
        SELECT 
            o.OID, 
            SUM(p.amount) AS Total_Supplies_Sold
        FROM 
            dbo.payments p
        INNER JOIN 
            dbo.office o ON p.OID = o.OID
        WHERE 
            p.updatedAt >= DATEADD(day, -365, GETDATE())
        GROUP BY 
            o.OID;
    `;
      query2 = `
    SELECT 
        o.OID, 
        SUM(p.amount) AS Total_Supplies_Sold
    FROM 
        dbo.payments p
    INNER JOIN 
        dbo.office o ON p.OID = o.OID
    WHERE 
        p.updatedAt >= DATEADD(day, -365, GETDATE())
    GROUP BY 
        o.OID;
`;
      break;
    case "alltime":
      query = `
        SELECT 
            o.OID, 
            SUM(p.amount) AS Total_Supplies_Sold
        FROM 
            dbo.payments p
        INNER JOIN 
            dbo.office o ON p.OID = o.OID
        GROUP BY 
            o.OID;
    `;
      query2 = `
    SELECT 
        o.OID, 
        SUM(p.amount) AS Total_Supplies_Sold
    FROM 
        dbo.payments p
    INNER JOIN 
        dbo.office o ON p.OID = o.OID
    GROUP BY 
        o.OID;
`;
      break;
    default:
      throw new Error("Invalid timeframe");
  }
  try {
    const result1 = await pool
      .request()
      .input("userID", sql.Int, userID)
      .query(query);
    const result2 = await pool
      .request()
      .input("userID", sql.Int, userID)
      .query(query2);
    const results = {
      sum: result1.recordset,
      tuples: result2.recordset,
    };
    res.json(results);
  } catch (error) {
    console.error("Error fetching Incomes:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
/*************************************************************************************/
/*************************************************************************************/
router.get("/AdminTotalPackagesDeleted", async (req, res) => {
  const { userID } = req.body;
  const { timeframe } = req.timeframe;

  if (!userID) {
    return res.status(400).json({ message: "User is not logged in." });
  }
  let query;
  let query2;

  switch (timeframe) {
    case "daily":
      query = `
        SELECT 
            COUNT(P.isDeleted) AS Total_Packages_Deleted, 
            S.updatedBy AS EmployeeNumber
        FROM 
            dbo.package AS P
        JOIN 
            (SELECT PID, MAX(timeOfStatus) AS LatestStatusTime
            FROM dbo.statuses
            WHERE timeOfStatus >= DATEADD(hour, -24, GETDATE())
            GROUP BY PID) AS LatestStatus
            ON P.PID = LatestStatus.PID
        JOIN 
            dbo.statuses AS S
            ON P.PID = S.PID
            AND S.timeOfStatus = LatestStatus.LatestStatusTime
        WHERE 
            P.isDeleted = 1
        GROUP BY 
            S.updatedBy;
    `;
      query2 = `
            SELECT 
                P.PID, 
                P.trackingNumber, 
                S.updatedBy, 
                S.timeOfStatus, 
                S.currOID
            FROM 
                dbo.package AS P
            JOIN 
                (SELECT PID, MAX(timeOfStatus) AS LatestStatusTime
                FROM dbo.statuses
                WHERE timeOfStatus >= DATEADD(hour, -24, GETDATE())
                GROUP BY PID) AS LatestStatus
                ON P.PID = LatestStatus.PID
            JOIN 
                dbo.statuses AS S
                ON P.PID = S.PID
                AND S.timeOfStatus = LatestStatus.LatestStatusTime
            WHERE 
                P.isDeleted = 0;
        `;
      break;
    case "weekly":
      query = `
        SELECT 
            COUNT(P.isDeleted) AS Total_Packages_Deleted, 
            S.updatedBy AS EmployeeNumber
        FROM 
            dbo.package AS P
        JOIN 
            (SELECT PID, MAX(timeOfStatus) AS LatestStatusTime
            FROM dbo.statuses
            WHERE timeOfStatus >= DATEADD(day, -7, GETDATE())
            GROUP BY PID) AS LatestStatus
            ON P.PID = LatestStatus.PID
        JOIN 
            dbo.statuses AS S
            ON P.PID = S.PID
            AND S.timeOfStatus = LatestStatus.LatestStatusTime
        WHERE 
            P.isDeleted = 1
        GROUP BY 
            S.updatedBy;
    `;
      query2 = `
            SELECT 
                P.PID, 
                P.trackingNumber, 
                S.updatedBy, 
                S.timeOfStatus, 
                S.currOID
            FROM 
                dbo.package AS P
            JOIN 
                (SELECT PID, MAX(timeOfStatus) AS LatestStatusTime
                FROM dbo.statuses
                WHERE timeOfStatus >= DATEADD(day, -7, GETDATE())
                GROUP BY PID) AS LatestStatus
                ON P.PID = LatestStatus.PID
            JOIN 
                dbo.statuses AS S
                ON P.PID = S.PID
                AND S.timeOfStatus = LatestStatus.LatestStatusTime
            WHERE 
                P.isDeleted = 0;
        `;
      break;
    case "monthly":
      query = `
        SELECT 
            COUNT(P.isDeleted) AS Total_Packages_Deleted, 
            S.updatedBy AS EmployeeNumber
        FROM 
            dbo.package AS P
        JOIN 
            (SELECT PID, MAX(timeOfStatus) AS LatestStatusTime
            FROM dbo.statuses
            WHERE timeOfStatus >= DATEADD(day, -30, GETDATE())
            GROUP BY PID) AS LatestStatus
            ON P.PID = LatestStatus.PID
        JOIN 
            dbo.statuses AS S
            ON P.PID = S.PID
            AND S.timeOfStatus = LatestStatus.LatestStatusTime
        WHERE 
            P.isDeleted = 1
        GROUP BY 
            S.updatedBy;
    `;
      query2 = `
            SELECT 
                P.PID, 
                P.trackingNumber, 
                S.updatedBy, 
                S.timeOfStatus, 
                S.currOID
            FROM 
                dbo.package AS P
            JOIN 
                (SELECT PID, MAX(timeOfStatus) AS LatestStatusTime
                FROM dbo.statuses
                WHERE timeOfStatus >= DATEADD(day, -30, GETDATE())
                GROUP BY PID) AS LatestStatus
                ON P.PID = LatestStatus.PID
            JOIN 
                dbo.statuses AS S
                ON P.PID = S.PID
                AND S.timeOfStatus = LatestStatus.LatestStatusTime
            WHERE 
                P.isDeleted = 0;
        `;
      break;
    case "yearly":
      query = `
        SELECT 
            COUNT(P.isDeleted) AS Total_Packages_Deleted, 
            S.updatedBy AS EmployeeNumber
        FROM 
            dbo.package AS P
        JOIN 
            (SELECT PID, MAX(timeOfStatus) AS LatestStatusTime
            FROM dbo.statuses
            WHERE timeOfStatus >= DATEADD(day, -365, GETDATE())
            GROUP BY PID) AS LatestStatus
            ON P.PID = LatestStatus.PID
        JOIN 
            dbo.statuses AS S
            ON P.PID = S.PID
            AND S.timeOfStatus = LatestStatus.LatestStatusTime
        WHERE 
            P.isDeleted = 1
        GROUP BY 
            S.updatedBy;
    `;
      query = `
            SELECT 
                P.PID, 
                P.trackingNumber, 
                S.updatedBy, 
                S.timeOfStatus, 
                S.currOID
            FROM 
                dbo.package AS P
            JOIN 
                (SELECT PID, MAX(timeOfStatus) AS LatestStatusTime
                FROM dbo.statuses
                WHERE timeOfStatus >= DATEADD(day, -365, GETDATE())
                GROUP BY PID) AS LatestStatus
                ON P.PID = LatestStatus.PID
            JOIN 
                dbo.statuses AS S
                ON P.PID = S.PID
                AND S.timeOfStatus = LatestStatus.LatestStatusTime
            WHERE 
                P.isDeleted = 0;
        `;
      break;
    case "alltime":
      query = `
        SELECT 
            COUNT(P.isDeleted) AS Total_Packages_Deleted, 
            S.updatedBy AS EmployeeNumber
        FROM 
            dbo.package AS P
        JOIN 
            (SELECT PID, MAX(timeOfStatus) AS LatestStatusTime
            FROM dbo.statuses
            GROUP BY PID) AS LatestStatus
            ON P.PID = LatestStatus.PID
        JOIN 
            dbo.statuses AS S
            ON P.PID = S.PID
            AND S.timeOfStatus = LatestStatus.LatestStatusTime
        WHERE 
            P.isDeleted = 1
        GROUP BY 
            S.updatedBy;
    `;
      query = `
            SELECT 
                P.PID, 
                P.trackingNumber, 
                S.updatedBy, 
                S.timeOfStatus, 
                S.currOID
            FROM 
                dbo.package AS P
            JOIN 
                (SELECT PID, MAX(timeOfStatus) AS LatestStatusTime
                FROM dbo.statuses
                GROUP BY PID) AS LatestStatus
                ON P.PID = LatestStatus.PID
            JOIN 
                dbo.statuses AS S
                ON P.PID = S.PID
                AND S.timeOfStatus = LatestStatus.LatestStatusTime
            WHERE 
                P.isDeleted = 0;
        `;
      break;
    default:
      throw new Error("Invalid timeframe");
  }
  try {
    const result1 = await pool
      .request()
      .input("userID", sql.Int, userID)
      .query(query);
    const result2 = await pool
      .request()
      .input("userID", sql.Int, userID)
      .query(query2);
    const results = {
      sum: result1.recordset,
      tuples: result2.recordset,
    };
    res.json(results);
  } catch (error) {
    console.error("Error fetching Incomes:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
/*************************************************************************************/
/*************************************************************************************/
