const { sql, poolPromise } = require('./db_connect.jsx');
import axios from 'axios';
// -------------------------------- ADMIN -------------------------------------------//
async function AdminIncomeBasedOnPayment(response, timeframe) {
    let query;

    switch (timeframe) {
        case 'daily':
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
        break;
    case 'weekly':
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
        break;
    case 'monthly':
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
        break;
    case 'yearly':
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
        break;
    case 'alltime':
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
        break;
        default:
            throw new Error('Invalid timeframe');
    }
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(query);
        return result.recordset;
    } catch (err) {
        console.error('SQL query failed:', err);
        throw err;
    }
}
async function AdminIncomeBasedOnPackage(response, timeframe) {
    let query;

    switch (timeframe) {
        case 'daily':
            query = "SELECT SUM(deliverPrice) AS TotalPackages FROM dbo.packages WHERE updatedAt >= DATEADD(hour, -24, GETDATE()";
            break;
        case 'weekly':
            query = "SELECT SUM(deliverPrice) AS TotalPackages FROM dbo.packages WHERE updatedAt >= DATEADD(day, -7, GETDATE()";
            break;
        case 'monthly':
            query = "SELECT SUM(deliverPrice) AS TotalPackages FROM dbo.packages WHERE updatedAt >= DATEADD(day, -30, GETDATE()";
            break;
        case 'yearly':
            query = "SELECT SUM(deliverPrice) AS TotalPackages FROM dbo.packages WHERE updatedAt >= DATEADD(day, -365, GETDATE()";
            break;
        case 'alltime':
            query = "SELECT SUM(deliverPrice) AS TotalPackages FROM dbo.packages FROM dbo.payments";
            break;
        default:
            throw new Error('Invalid timeframe');
    }
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(query);
        return result.recordset;
    } catch (err) {
        console.error('SQL query failed:', err);
        throw err;
    }
}
function AdminTotalPacketsIncomingNOutgoing(response) {


}
async function AdminTotalSuppliesSold(response, timeframe) {
    let query;

    switch (timeframe) {
        case 'daily':
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
    case 'weekly':
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
    case 'monthly':
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
    case 'yearly':
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
    case 'alltime':
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
        console.error('SQL query failed:', err);
        throw err;
    }

}
async function AdminTotalPackagesDeleted(timeframe){
    let query;

    switch (timeframe) {
        case 'daily':
            query = "SELECT SUM(P.*) AS Total_Packages_Deleted, S.updatedBy AS Employee_Number FROM dbo.package AS P, dbo.status as P WHERE updatedAt >= DATEADD(hour, -24, GETDATE() AND isDeleted=TRUE AND P.PID = S.PID";
            break;
        case 'weekly':
            query = "SELECT SUM(P.*) AS Total_Packages_Deleted, S.updatedBy AS Employee_Number FROM dbo.package AS P, dbo.status as P WHERE updatedAt >= DATEADD(day, -7, GETDATE() AND isDeleted=TRUE AND P.PID = S.PID";
            break;
        case 'monthly':
            query = "SELECT SUM(P.*) AS Total_Packages_Deleted, S.updatedBy AS Employee_Number FROM dbo.package AS P, dbo.status as P WHERE updatedAt >= DATEADD(day, -30, GETDATE() AND isDeleted=TRUE AND P.PID = S.PID";
            break;
        case 'yearly':
            query = "SELECT SUM(P.*) AS Total_Packages_Deleted, S.updatedBy AS Employee_Number FROM dbo.package AS P, dbo.status as P WHERE updatedAt >= DATEADD(day, -365, GETDATE() AND isDeleted=TRUE AND P.PID = S.PID";
            break;
        case 'alltime':
            query = "SELECT SUM(*) AS Total_Supplies_Sold FROM dbo.payments";
            break;
        default:
            throw new Error('Invalid timeframe');
    }
    try {
        const response = await axios.post('http://localhost:3001/admin/total-packages-deleted', { query });
        console.log('Query result:', response.data);
        return response.data;
    } catch (err) {
        console.error('Error sending query to backend:', err);
        throw err;
    }
}




// -------------------------------- MANAGER -------------------------------------------//






async function ManagerIncomeBasedOnPayment(response, timeframe) {
    let query;

    /*EXAMPLE */
    let officeId = 2;

    switch (timeframe) {
        case 'daily':
            query = "SELECT SUM(payments) AS TotalIncome FROM dbo.payments, dbo.office WHERE updatedAt >= DATEADD(hour, -24, GETDATE() AND payments.OID = ${officeId}";
            break;
        case 'weekly':
            query = "SELECT SUM(payments) AS TotalIncome FROM dbo.payments WHERE updatedAt >= DATEADD(day, -7, GETDATE() AND payments.OID = ${officeId}";
            break;
        case 'monthly':
            query = "SELECT SUM(payments) AS TotalIncome FROM dbo.payments WHERE updatedAt >= DATEADD(day, -30, GETDATE() AND payments.OID = ${officeId}";
            break;
        case 'yearly':
            query = "SELECT SUM(payments) AS TotalIncome FROM dbo.payments WHERE updatedAt >= DATEADD(day, -365, GETDATE() AND payments.OID = ${officeId}";
            break;
        case 'alltime':
            query = "SELECT SUM(payments) AS TotalIncome FROM dbo.payments WHERE payments.OID = ${officeId}";
            break;
        default:
            throw new Error('Invalid timeframe');
    }
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(query);
        return result.recordset;
    } catch (err) {
        console.error('SQL query failed:', err);
        throw err;
    }
}
async function ManagerIncomeBasedOnPackage(response, timeframe) {
    let query;
    /*EXAMPLE */
    let officeId = 2;

    switch (timeframe) {
        case 'daily':
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
        case 'weekly':
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
        case 'monthly':
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
        case 'yearly':
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
        case 'alltime':
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
            throw new Error('Invalid timeframe');
    }
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(query);
        return result.recordset;
    } catch (err) {
        console.error('SQL query failed:', err);
        throw err;
    }

}
function ManagerTotalPacketsIncomingNOutgoing(response, timeframe) {
    

}
async function ManagerTotalSuppliesSold(response, timeframe) {
    let query;
    /*EXAMPLE */
    let officeId = 2;

    switch (timeframe) {
        case 'daily':
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
        case 'weekly':
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
        case 'monthly':
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
        case 'yearly':
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
        case 'alltime':
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
            throw new Error('Invalid timeframe');
    }
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(query);
        return result.recordset;
    } catch (err) {
        console.error('SQL query failed:', err);
        throw err;
    }

}
async function ManagerEmployeeWorkload(response, timeframe){
    let query;
    /*EXAMPLE */
    let officeId = 2;

    switch (timeframe) {
        case 'daily':
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
        case 'weekly':
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
        case 'monthly':
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
        case 'yearly':
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
        case 'alltime':
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
            throw new Error('Invalid timeframe');
    }
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(query);
        return result.recordset;
    } catch (err) {
        console.error('SQL query failed:', err);
        throw err;
    }
}
async function ManagerTotalPackagesDeleted(response, timeframe){
    let query;

    switch (timeframe) {
        case 'daily':
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
        case 'weekly':
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
        case 'monthly':
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
        case 'yearly':
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
        case 'alltime':
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
            throw new Error('Invalid timeframe');
    }
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(query);
        return result.recordset;
    } catch (err) {
        console.error('SQL query failed:', err);
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
    ManagerTotalPackagesDeleted
};
// Admin // 
exports.AdminIncomeBasedOnPayment = AdminIncomeBasedOnPayment;
exports.AdminIncomeBasedOnPackage = AdminIncomeBasedOnPackage;
exports.AdminTotalPacketsIncomingNOutgoing = AdminTotalPacketsIncomingNOutgoing;
exports.AdminTotalSuppliesSold = AdminTotalSuppliesSold;
exports.AdminTotalPackagesDeleted = AdminTotalPackagesDeleted;

// Manager //
exports.ManagerIncomeBasedOnPayment = ManagerIncomeBasedOnPayment;
exports.ManagerIncomeBasedOnPackage = ManagerIncomeBasedOnPackage;
exports.ManagerTotalPacketsIncomingNOutgoing = ManagerTotalPacketsIncomingNOutgoing;
exports.ManagerTotalSuppliesSold = ManagerTotalSuppliesSold;
exports.ManagerEmployeeWorkload = ManagerEmployeeWorkload;
exports.ManagerTotalPackagesDeleted = ManagerTotalPackagesDeleted;