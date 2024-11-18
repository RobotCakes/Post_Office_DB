const { sql, poolPromise } = require("./db_connect.jsx");
import axios from "axios";
// -------------------------------- ADMIN -------------------------------------------//
async function AdminIncomeBasedOnPaymentNum(timeframe) {
  let query;

  switch (timeframe) {
    case "daily":
      query = `
            SELECT 
                o.OID, 
                SUM(p.amount) AS TotalIncome 
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
                SUM(p.amount) AS TotalIncome 
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
                SUM(p.amount) AS TotalIncome 
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
                SUM(p.amount) AS TotalIncome 
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
                SUM(p.amount) AS TotalIncome 
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
    const pool = await poolPromise;
    const result = await pool.request().query(query);
    return result.recordset;
  } catch (err) {
    console.error("SQL query failed:", err);
    throw err;
  }
}
async function AdminIncomeBasedOnPayment(timeframe) {
  let query;

  switch (timeframe) {
    case "daily":
      query = `
            SELECT 
                o.OID, 
                SUM(p.amount) AS TotalIncome 
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
                SUM(p.amount) AS TotalIncome 
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
                SUM(p.amount) AS TotalIncome 
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
                SUM(p.amount) AS TotalIncome 
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
                SUM(p.amount) AS TotalIncome 
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
    const pool = await poolPromise;
    const result = await pool.request().query(query);
    return result.recordset;
  } catch (err) {
    console.error("SQL query failed:", err);
    throw err;
  }
}
async function AdminIncomeBasedOnPackageNum(response, timeframe) {
  let query;

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
      break;
    default:
      throw new Error("Invalid timeframe");
  }
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(query);
    return result.recordset;
  } catch (err) {
    console.error("SQL query failed:", err);
    throw err;
  }
}
async function AdminIncomeBasedOnPackage(response, timeframe) {
  let query;

  switch (timeframe) {
    case "daily":
      query = `
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
    const pool = await poolPromise;
    const result = await pool.request().query(query);
    return result.recordset;
  } catch (err) {
    console.error("SQL query failed:", err);
    throw err;
  }
}
async function AdminTotalSuppliesSoldNum(response, timeframe) {
  let query;

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
      break;
  }
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(query);
    return result.recordset;
  } catch (err) {
    console.error("SQL query failed:", err);
    throw err;
  }
}
async function AdminTotalSuppliesSold(response, timeframe) {
  let query;

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
      break;
  }
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(query);
    return result.recordset;
  } catch (err) {
    console.error("SQL query failed:", err);
    throw err;
  }
}
async function AdminTotalPackagesDeletedNum(timeframe) {
  let query;

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
      break;
    default:
      throw new Error("Invalid timeframe");
  }
  try {
    const response = await axios.post(
      "http://localhost:3001/admin/total-packages-deleted",
      { query }
    );
    console.log("Query result:", response.data);
    return response.data;
  } catch (err) {
    console.error("Error sending query to backend:", err);
    throw err;
  }
}
async function AdminTotalPackagesDeleted(timeframe) {
  let query;

  switch (timeframe) {
    case "daily":
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
    const response = await axios.post(
      "http://localhost:3001/admin/total-packages-deleted",
      { query }
    );
    console.log("Query result:", response.data);
    return response.data;
  } catch (err) {
    console.error("Error sending query to backend:", err);
    throw err;
  }
}

// -------------------------------- MANAGER -------------------------------------------//

async function ManagerIncomeBasedOnPayment(response, timeframe) {
  let query;

  /*EXAMPLE */
  let officeId = 2;

  switch (timeframe) {
    case "daily":
      query =
        "SELECT SUM(payments) AS TotalIncome FROM dbo.payments, dbo.office WHERE updatedAt >= DATEADD(hour, -24, GETDATE() AND payments.OID = ${officeId}";
      break;
    case "weekly":
      query =
        "SELECT SUM(payments) AS TotalIncome FROM dbo.payments WHERE updatedAt >= DATEADD(day, -7, GETDATE() AND payments.OID = ${officeId}";
      break;
    case "monthly":
      query =
        "SELECT SUM(payments) AS TotalIncome FROM dbo.payments WHERE updatedAt >= DATEADD(day, -30, GETDATE() AND payments.OID = ${officeId}";
      break;
    case "yearly":
      query =
        "SELECT SUM(payments) AS TotalIncome FROM dbo.payments WHERE updatedAt >= DATEADD(day, -365, GETDATE() AND payments.OID = ${officeId}";
      break;
    case "alltime":
      query =
        "SELECT SUM(payments) AS TotalIncome FROM dbo.payments WHERE payments.OID = ${officeId}";
      break;
    default:
      throw new Error("Invalid timeframe");
  }
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(query);
    return result.recordset;
  } catch (err) {
    console.error("SQL query failed:", err);
    throw err;
  }
}
async function ManagerIncomeBasedOnPackage(response, timeframe) {
  let query;
  /*EXAMPLE */
  let officeId = 2;

  switch (timeframe) {
    case "daily":
      query = `
                SELECT 
                    SUM(p.deliverPrice) AS TotalDeliverPrice
                FROM 
                    packages p
                JOIN (
                    SELECT 
                        PID, 
                        MIN(timeOfStatus) AS OldestStatusTime
                    FROM 
                        dbo.statuses
                    WHERE 
                        currOID = @officeId
                        AND timeOfStatus >= DATEADD(hour, -24, GETDATE())
                    GROUP BY 
                        PID
                ) AS oldest_statuses ON p.PID = oldest_statuses.PID;
                `;
      break;
    case "weekly":
      query = `
                SELECT 
                    SUM(p.deliverPrice) AS TotalDeliverPrice
                FROM 
                    packages p
                JOIN (
                    SELECT 
                        PID, 
                        MIN(timeOfStatus) AS OldestStatusTime
                    FROM 
                        dbo.statuses
                    WHERE 
                        currOID = @officeId
                        AND timeOfStatus >= DATEADD(day, -7, GETDATE())
                    GROUP BY 
                        PID
                ) AS oldest_statuses ON p.PID = oldest_statuses.PID;
                `;
      break;
    case "monthly":
      query = `
                SELECT 
                    SUM(p.deliverPrice) AS TotalDeliverPrice
                FROM 
                    packages p
                JOIN (
                    SELECT 
                        PID, 
                        MIN(timeOfStatus) AS OldestStatusTime
                    FROM 
                        dbo.statuses
                    WHERE 
                        currOID = @officeId
                        AND timeOfStatus >= DATEADD(day, -7, GETDATE())
                    GROUP BY 
                        PID
                ) AS oldest_statuses ON p.PID = oldest_statuses.PID;
                `;
      break;
    case "yearly":
      query = `
                SELECT 
                    SUM(p.deliverPrice) AS TotalDeliverPrice
                FROM 
                    packages p
                JOIN (
                    SELECT 
                        PID, 
                        MIN(timeOfStatus) AS OldestStatusTime
                    FROM 
                        dbo.statuses
                    WHERE 
                        currOID = @officeId
                        AND timeOfStatus >= DATEADD(day, -365, GETDATE())
                    GROUP BY 
                        PID
                ) AS oldest_statuses ON p.PID = oldest_statuses.PID;
                `;
      break;
    case "alltime":
      query = `
                SELECT 
                    SUM(p.deliverPrice) AS TotalDeliverPrice
                FROM 
                    packages p
                JOIN (
                    SELECT 
                        PID, 
                        MIN(timeOfStatus) AS OldestStatusTime
                    FROM 
                        dbo.statuses
                    WHERE 
                        currOID = @officeId
                    GROUP BY 
                        PID
                ) AS oldest_statuses ON p.PID = oldest_statuses.PID;
                `;
      break;
    default:
      throw new Error("Invalid timeframe");
  }
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(query);
    return result.recordset;
  } catch (err) {
    console.error("SQL query failed:", err);
    throw err;
  }
}
function ManagerTotalPacketsIncomingNOutgoing(response, timeframe) {}
async function ManagerTotalSuppliesSold(response, timeframe) {
  let query;
  /*EXAMPLE */
  let officeId = 2;

  switch (timeframe) {
    case "daily":
      query = `
            SELECT 
                p.suppliesID,
                SUM(p.amount) AS Total_Supplies_Sold
            FROM 
                dbo.payments p
            WHERE 
                p.updatedAt >= DATEADD(hour, -24, GETDATE())
                AND p.OID = @officeId
            GROUP BY 
                p.suppliesID;
            `;
      break;
    case "weekly":
      query = `
            SELECT 
                p.suppliesID,
                SUM(p.amount) AS Total_Supplies_Sold
            FROM 
                dbo.payments p
            WHERE 
                p.updatedAt >= DATEADD(day, -7, GETDATE())
                AND p.OID = @officeId
            GROUP BY 
                p.suppliesID;
            `;
      break;
    case "monthly":
      query = `
            SELECT 
                p.suppliesID,
                SUM(p.amount) AS Total_Supplies_Sold
            FROM 
                dbo.payments p
            WHERE 
                p.updatedAt >= DATEADD(day, -30, GETDATE())
                AND p.OID = @officeId
            GROUP BY 
                p.suppliesID;
            `;
      break;
    case "yearly":
      query = `
                SELECT 
                    p.suppliesID,
                    SUM(p.amount) AS Total_Supplies_Sold
                FROM 
                    dbo.payments p
                WHERE 
                    p.updatedAt >= DATEADD(day, -365, GETDATE())
                    AND p.OID = @officeId
                GROUP BY 
                    p.suppliesID;
            `;
      break;
    case "alltime":
      query = `
            SELECT 
                p.suppliesID,
                SUM(p.amount) AS Total_Supplies_Sold
            FROM 
                dbo.payments p
            WHERE 
                p.OID = @officeId
            GROUP BY 
                p.suppliesID;
            `;
      break;
    default:
      throw new Error("Invalid timeframe");
  }
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(query);
    return result.recordset;
  } catch (err) {
    console.error("SQL query failed:", err);
    throw err;
  }
}
async function ManagerEmployeeWorkload(response, timeframe) {
  let query;
  /*EXAMPLE */
  let officeId = 2;

  switch (timeframe) {
    case "daily":
      query = `
                SELECT 
                    EID,
                    COUNT(*) AS AuditCount
                FROM 
                    dbo.auditlog
                WHERE 
                    updatedAt >= DATEADD(hour, -24, GETDATE()) 
                    AND a.OID = @officeId
                GROUP BY 
                    EID;
            `;
      break;
    case "weekly":
      query = `
                SELECT 
                    EID,
                    COUNT(*) AS AuditCount
                FROM 
                    dbo.auditlog
                WHERE 
                    updatedAt >= DATEADD(hour, -24, GETDATE()) 
                    AND a.OID = @officeId
                GROUP BY 
                    EID;
            `;
      break;
    case "monthly":
      query = `
                SELECT 
                    EID,
                    COUNT(*) AS AuditCount
                FROM 
                    dbo.auditlog
                WHERE 
                    updatedAt >= DATEADD(hour, -24, GETDATE()) 
                    AND a.OID = @officeId
                GROUP BY 
                    EID;
            `;
      break;
    case "yearly":
      query = `
                SELECT 
                    EID,
                    COUNT(*) AS AuditCount
                FROM 
                    dbo.auditlog
                WHERE 
                    updatedAt >= DATEADD(hour, -24, GETDATE()) 
                    AND a.OID = @officeId
                GROUP BY 
                    EID;
            `;
      break;
    case "alltime":
      query = `
                SELECT 
                    EID,
                    COUNT(*) AS AuditCount
                FROM 
                    dbo.auditlog a
                WHERE 
                    a.OID = @officeId
                GROUP BY 
                    EID;
            `;
      break;
    default:
      throw new Error("Invalid timeframe");
  }
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(query);
    return result.recordset;
  } catch (err) {
    console.error("SQL query failed:", err);
    throw err;
  }
}
async function ManagerTotalPackagesDeleted(response, timeframe) {
  let query;

  switch (timeframe) {
    case "daily":
      query = `
                SELECT 
                    COUNT(p.PID) AS TotalDeletedPackages
                FROM 
                    dbo.packages p
                JOIN 
                    (SELECT 
                        PID, 
                        MAX(timeOfStatus) AS NewestStatusTime
                    FROM 
                        dbo.statuses
                    GROUP BY 
                        PID
                    ) AS latestStatus ON p.PID = latestStatus.PID
                JOIN 
                    dbo.statuses s ON s.PID = latestStatus.PID AND s.timeOfStatus = latestStatus.NewestStatusTime
                WHERE 
                    s.currOID = @officeId AND 
                    p.isDeleted = TRUE AND
                    latestStatus.NewestStatusTime >= DATEADD(hour, -24, GETDATE());
            `;
      break;
    case "weekly":
      query = `
                SELECT 
                    COUNT(p.PID) AS TotalDeletedPackages
                FROM 
                    dbo.packages p
                JOIN 
                    (SELECT 
                        PID, 
                        MAX(timeOfStatus) AS NewestStatusTime
                    FROM 
                        dbo.statuses
                    GROUP BY 
                        PID
                    ) AS latestStatus ON p.PID = latestStatus.PID
                JOIN 
                    dbo.statuses s ON s.PID = latestStatus.PID AND s.timeOfStatus = latestStatus.NewestStatusTime
                WHERE 
                    s.currOID = @officeId AND 
                    p.isDeleted = TRUE AND
                    latestStatus.NewestStatusTime >= DATEADD(day, -7, GETDATE());
            `;
      break;
    case "monthly":
      query = `
                SELECT 
                    COUNT(p.PID) AS TotalDeletedPackages
                FROM 
                    dbo.packages p
                JOIN 
                    (SELECT 
                        PID, 
                        MAX(timeOfStatus) AS NewestStatusTime
                    FROM 
                        dbo.statuses
                    GROUP BY 
                        PID
                    ) AS latestStatus ON p.PID = latestStatus.PID
                JOIN 
                    dbo.statuses s ON s.PID = latestStatus.PID AND s.timeOfStatus = latestStatus.NewestStatusTime
                WHERE 
                    s.currOID = @officeId AND 
                    p.isDeleted = TRUE AND
                    latestStatus.NewestStatusTime >= DATEADD(day, -30, GETDATE());
            `;
      break;
    case "yearly":
      query = `
                SELECT 
                    COUNT(p.PID) AS TotalDeletedPackages
                FROM 
                    dbo.packages p
                JOIN 
                    (SELECT 
                        PID, 
                        MAX(timeOfStatus) AS NewestStatusTime
                    FROM 
                        dbo.statuses
                    GROUP BY 
                        PID
                    ) AS latestStatus ON p.PID = latestStatus.PID
                JOIN 
                    dbo.statuses s ON s.PID = latestStatus.PID AND s.timeOfStatus = latestStatus.NewestStatusTime
                WHERE 
                    s.currOID = @officeId AND 
                    p.isDeleted = TRUE AND
                    latestStatus.NewestStatusTime >= DATEADD(day, -365, GETDATE());
            `;
      break;
    case "alltime":
      query = `
                SELECT 
                    COUNT(p.PID) AS TotalDeletedPackages
                FROM 
                    dbo.packages p
                JOIN 
                    (SELECT 
                        PID, 
                        MAX(timeOfStatus) AS NewestStatusTime
                    FROM 
                        dbo.statuses
                    GROUP BY 
                        PID
                    ) AS latestStatus ON p.PID = latestStatus.PID
                JOIN 
                    dbo.statuses s ON s.PID = latestStatus.PID AND s.timeOfStatus = latestStatus.NewestStatusTime
                WHERE 
                    s.currOID = @officeId AND 
                    p.isDeleted = TRUE;
            `;
      break;
    default:
      throw new Error("Invalid timeframe");
  }
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(query);
    return result.recordset;
  } catch (err) {
    console.error("SQL query failed:", err);
    throw err;
  }
}
// Admin //
module.exports = {
  AdminIncomeBasedOnPayment,
  AdminIncomeBasedOnPackage,
  AdminTotalPacketsIncomingNOutgoing,
  AdminTotalSuppliesSold,
  AdminTotalPackagesDeleted,
  ManagerIncomeBasedOnPayment,
  ManagerIncomeBasedOnPackage,
  ManagerTotalPacketsIncomingNOutgoing,
  ManagerTotalSuppliesSold,
  ManagerEmployeeWorkload,
  ManagerTotalPackagesDeleted,
};
// Admin //
exports.AdminIncomeBasedOnPaymentNum = AdminIncomeBasedOnPaymentNum;
exports.AdminIncomeBasedOnPayment = AdminIncomeBasedOnPayment;
exports.AdminIncomeBasedOnPackageNum = AdminIncomeBasedOnPackageNum;
exports.AdminIncomeBasedOnPackage = AdminIncomeBasedOnPackage;
exports.AdminTotalSuppliesSoldNum = AdminTotalSuppliesSoldNum;
exports.AdminTotalSuppliesSold = AdminTotalSuppliesSold;
exports.AdminTotalPackagesDeletedNum = AdminTotalPackagesDeletedNum;
exports.AdminTotalPackagesDeleted = AdminTotalPackagesDeleted;

// Manager //
exports.ManagerIncomeBasedOnPayment = ManagerIncomeBasedOnPayment;
exports.ManagerIncomeBasedOnPackage = ManagerIncomeBasedOnPackage;
exports.ManagerTotalSuppliesSold = ManagerTotalSuppliesSold;
exports.ManagerEmployeeWorkload = ManagerEmployeeWorkload;
exports.ManagerTotalPackagesDeleted = ManagerTotalPackagesDeleted;
