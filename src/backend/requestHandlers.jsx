/*handles all queries and such */
var fs = require('fs');
var sql = require('mssql');
var config = require('./db_connect');
var querystring = require('querystring');
var bcrypt = require('bcryptjs');

var cons = require('consolidate');


const { Console, error } = require('console');

function loginverify(response, postData, sessionData = null) {
    //function loginverify(response, postData) {
    var params = querystring.parse(postData);
    var username = params['Username'];
    var password = params['Password'];
    var adminlogin = params['adminLogin'];
    if (!sessionData) {
        console.log("SessionData is null");
    } else {
        console.log("Session ID in login verify: " + sessionData.getSessonId());
    }
    //    var connect = fs.readFileSync('db_connect.js');

    var conn = new sql.ConnectionPool(config);
    sql.connect(config).then(function () {
        var req = new sql.Request();
        req.input('username', sql.NVarChar, username);
        req.input('password', sql.NVarChar, password);
        req.query("SELECT HashedPassword, TemporaryPassword FROM Login WHERE Username=@username").then(function (recordset) {
            if (recordset.recordsets[0].length > 0) {
                var hash = recordset.recordsets[0][0].HashedPassword;
                var temp = recordset.recordsets[0][0].TemporaryPassword;
                bcrypt.compare(password, hash, function (err, result) {
                    if (result) {
                        // Passwords match, show a success message
                        console.log("success");
                        sessionData.logginId = username;
                        sessionData.loggedDT = new Date().toLocaleString().replace(',', '');
                        console.log("Temp =" + temp);
                        if (temp) {
                            cons.ejs('./changePassword.html', { username: username, oldpassword: password }, function (err, html) {
                                if (err) {
                                    console.error('Error templating with EJS');
                                    throw err;
                                }
                                response.write(html);
                                response.end();
                                //return;
                            });

                            //response.writeHead(302, {"Location": "/changePassword"})
                        } else {
                            if (adminlogin && (username.charAt(0) === 'F')) {
                                req.query("SELECT Admin_ID FROM Admin WHERE Admin_ID=@username").then(function (recordset) {
                                    if (recordset.recordsets[0].length > 0) {
                                        sendFile(response, "adminUI.html", sessionData.getSessonId());
                                        // response.writeHead(302, { "Location": "/adminUI" });
                                        // response.end();
                                    } else {
                                        sendFile(response, "borrowHolds.html", sessionData.getSessonId());
                                    }
                                    
                                }).catch(function (err) {
                                    console.log(err);
                                    response.end();
                                    return;
                                });
                                //response.writeHead(302, {'Cookie': 'sessionId=${sessionData.getSessonId()}' "Location": "/adminUI" });
                            } else {
                                //response.writeHead(302, {"Location": "/memberUI" });
                                sendFile(response, "borrowHolds.html", sessionData.getSessonId());

                                // var hd = "{'Set-Cookie': 'sessionId=" + sessionData.getSessonId() + "', 'Location': '/memberUI' }";
                                // response.writeHead(302, hd);
                                //                                response.writeHead(302, `{'Set-Cookie': 'sessionId=${sessionData.getSessonId()}', "Location": "/memberUI" }`);
                            }
                        }
                        console.log("response ended");
                    } else {
                        // Passwords do not match, show an error message
                        console.log("Failed");
                        sendEJSFile(response, "login.html", "Username/Password did not match!!!");
                        // response.writeHead(302, { "Location": "/login" });
                        // response.end();
                    }
                });
                //response.writeHead(302, { "Location": "/search" });
                //response.end();
            } else {
                sendEJSFile(response, "login.html", "Username/Password did not match!!!");
                // Username and password are incorrect, show an error message
                //response.writeHead(200, { "Content-Type": "text/html" });
                //response.write("<p>Login failed</p>");
                // response.writeHead(302, { "Location": "/login" });
                // response.end();
            }
            //conn.close();
        }).catch(function (err) {
            console.log(err);
            //conn.close();
        });
    }).catch(function (err) {
        console.log(err);
    });

}

function sendEJSFile(response, filename, msgtxt) {
    cons.ejs(filename, { msg: msgtxt }, function (err, html) {
        if (err) {
          console.error('Error templating with EJS');
          throw err;
        }
        response.write(html);
        response.end();
        return;
      });
}
async function addPackage(response, postData){
    const pool = await sql.connect(config);
    var req = new sql.Request();
    var querystring = require('querystring');
    var params = querystring.parse(postData);
    const params = JSON.parse(postData);
    const { senderName, senderAddress, receiverName, receiverAddress, receiverUID, senderUID, expectedDeliveryDate} = params;

    const resultTrackingInfo = await pool.request()
        .input('senderName', sql.Int, senderName)
        .input('senderAddress', sql.Int, senderAddress)
        .input('receiverName', sql.Int, receiverName)
        .input('receiverAddress', sql.Int, receiverAddress)
        .input('receiverUID', sql.Int, receiverUID)
        .input('senderUID', sql.Int, senderUID)
        .input('expectedDeliveryDate', sql.sql.DateTime, expectedDeliveryDate)
        .query(`
            INSERT INTO dbo.trackinginfo (senderName, senderAddress, receiverName, receiverAddress, receiverUID, senderUID, expectedDeliveryDate)
            OUTPUT INSERTED.trackingNumber
            VALUES (@senderName, @senderAddress, @receiverName, @receiverAddress, @receiverUID, @senderUID, @expectedDeliveryDate)
        `);

    const trackingNumber = resultTrackingInfo.recordset[0].trackingNumber;

    const { packageContent, packageLength, packageWidth, packageHeight, weight, deliverPrice, isDelivery, signatureRequired, deliveryPriority, isFragile } = params;
    
    const resultPackage = await pool.request()
        .input('trackingNumber', sql.NVarChar(12), trackingNumber)
        .input('packageContent', sql.NVarChar(255), packageContent)
        .input('packageLength', sql.Float, packageLength)
        .input('packageWidth', sql.Float, packageWidth)
        .input('packageHeight', sql.Float, packageHeight)
        .input('weight', sql.Float, weight)
        .input('deliverPrice', sql.Float, deliverPrice)
        .input('isDelivery', sql.Bit, isDelivery)
        .input('signatureRequired', sql.Bit, signatureRequired)
        .input('deliveryPriority', sql.Int, deliveryPriority)
        .input('isFragile', sql.Bit, isFragile)
        .query(`
            INSERT INTO dbo.package (trackingNumber, weight, deliverPrice, isDelivery, signatureRequired, deliveryPriority, isFragile)
            OUTPUT INSERTED.PID
            VALUES (@trackingNumber, @weight, @deliverPrice, @isDelivery, @signatureRequired, @deliveryPriority, @isFragile)
        `);

    const packagePID = resultPackage.recordset[0].PID;

    const { state, updatedBy, timeOfStatus, currOID, nextOID, userTypeUpdate } = params;

    await pool.request()
        .input('state', sql.NVarChar(100), state)
        .input('updatedBy', sql.Int, updatedBy)
        .input('timeOfStatus', sql.DateTime, timeOfStatus || new Date()) 
        .input('currOID', sql.Int, currOID)
        .input('PID', sql.Int, packagePID)
        .input('nextOID', sql.Int, nextOID)
        .input('userTypeUpdate', sql.NVarChar(50), userTypeUpdate)
        .query(`
            INSERT INTO dbo.statuses (state, updatedBy, timeOfStatus, currOID, PID, nextOID, userTypeUpdate)
            VALUES (@state, @updatedBy, @timeOfStatus, @currOID, @PID, @nextOID, @userTypeUpdate)
        `);

    const resultStatus = await pool.request()
        .input('PID', sql.Int, packagePID)
        .query(`
            SELECT SID FROM statuses
            WHERE PID = @PID
            AND state = @state
        `);

    const currentStatus = resultStatus.recordset[0].SID;

    await pool.request()
        .input('currentStatus', sql.Int, currentStatus)
        .input('trackingNumber', sql.NVarChar(12), trackingNumber)
        .query(`
            UPDATE dbo.trackinginfo
            SET currentStatus = @currentStatus
            WHERE trackingNumber = @trackingNumber
        `);

    response.status(200).json({ message: 'Package added successfully' });
}
async function addLogin(response){

}
async function displayingCustomerPackages(response){
    let query;

    query = `
        SELECT 
            ti.trackingNumber, p.packageContent, s.currentLocation, ti.expectedDeliveryDate
        FROM 
            dbo.packages AS p,
            dbo.trackingInfo AS ti,
            dbo.statuses AS s,
        WHERE 
            ti.senderUID = @userID,
            ti.trackingNumber = p.trackingNumber,
            s.PID = p.PID,
            ti.currentStatus = s.SID,
        `;
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(query);
        return result.recordset;
    } catch (err) {
        console.error('SQL query failed:', err);
        throw err;
    }
}
async function displayingEmployeePackages(response){
    query = `
        SELECT 
            ti.trackingNumber AS Tracking Number, p.packageContent AS Content, TIMESTAMPDIFF(HOUR, s.timeOfStatus, NOW()) AS Time within Office,, p.deliveryPriority AS Priority
        FROM 
            dbo.packages AS p,
            dbo.trackingInfo AS ti,
            dbo.statuses AS s,
        WHERE 
            s.currOID = @officeID,
            ti.currentStatus = s.SID,
            p.trackingNumber = ti.trackingNumber,
            s.PID = p.PID,
        ORDER BY p.priority DESC,
        `;
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(query);
        return result.recordset;
    } catch (err) {
        console.error('SQL query failed:', err);
        throw err;
    }
}
async function displayingManagerPackages(response){
    query = `
        SELECT 
            ti.trackingNumber AS Tracking Number, p.packageContent AS Content, TIMESTAMPDIFF(HOUR, s.timeOfStatus, NOW()) AS Time within Office,, p.deliveryPriority AS Priority
        FROM 
            dbo.packages AS p,
            dbo.trackingInfo AS ti,
            dbo.statuses AS s,
        WHERE 
            s.currOID = @officeID,
            ti.currentStatus = s.SID,
            p.trackingNumber = ti.trackingNumber,
            s.PID = p.PID,
        ORDER BY p.priority DESC,
        `;
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(query);
        return result.recordset;
    } catch (err) {
        console.error('SQL query failed:', err);
        throw err;
    }
}
async function displayingLocationSupplies(response){
    let query1;
    let query2;


    query1 = `
        SELECT 
            su.supplyID AS ID, su.quanity AS Quanity, su.description AS Details,
        FROM
            dbo.supplies AS su
        `;

    query2 = `
        SELECT 
            su.supplyID AS ID, su.quanity AS Quanity, su.description AS Details,
        FROM
            dbo.supplies AS su
        WHERE
            su.OID = @officeID
        `;
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(query);
        return result.recordset;
    } catch (err) {
        console.error('SQL query failed:', err);
        throw err;
    }
}
async function displayingEmployeeIncomingPackages(response){
    let query1;

    query1 = `
        SELECT 
            ti.trackingNumber AS Tracking Number, p.packageContent AS Content, s.currentOID AS Current Location, p.deliveryPriority,
        FROM
            dbo.packages AS p,
            dbo.trackingInfo AS ti,
            dbo.statuses AS s,
        WHERE 
            s.nextOID = @officeID,
            ti.currentStatus = s.SID,
            p.trackingNumber = ti.trackingNumber,
            s.PID = p.PID,
        ORDER BY p.priority DESC,
        `;
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(query);
        return result.recordset;
    } catch (err) {
        console.error('SQL query failed:', err);
        throw err;
    }
}
async function displayingManagerManageEmployees(response){
    let query1;
    /* YOU NEED TO JOIN THIS */
    query1 = `
        SELECT 
            e.EID AS EmployeeID, 
            n.firstName AS First Name, 
            n.lastName AS Last Name,
            e.employeeStartDate AS Start Date,
        FROM
            dbo.employee AS e
        WHERE 
            e.isManager = 1,
            e.OID = @officeID,
        ORDER BY e.EID DESC,
        `;
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(query);
        return result.recordset;
    } catch (err) {
        console.error('SQL query failed:', err);
        throw err;
    }
}
async function displayingAdminManageEmployees(response){
    let query1;
    /* YOU NEED TO JOIN THIS */
    query1 = `
        SELECT 
            e.EID AS EmployeeID, 
            n.firstName AS First Name, 
            n.lastName AS Last Name,
            o.name AS Office Name,
            o.EID AS Direct Manager
        FROM
            dbo.employee AS e,
            dbo.offices AS o,
        WHERE 
            e.isManager = 1,
        ORDER BY o.name DESC,
        `;
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(query);
        return result.recordset;
    } catch (err) {
        console.error('SQL query failed:', err);
        throw err;
    }
}
async function displayingAdminManageManagers(response){
    let query1;
    /* YOU NEED TO JOIN THIS */
    query1 = `
        SELECT 
            e.EID AS EmployeeID, 
            n.firstName AS First Name, 
            n.lastName AS Last Name,
            o.name AS Office Name,
        FROM
            dbo.employee AS e,
            dbo.offices AS o,
        WHERE
            e.isManager = 1 
        ORDER BY o.name DESC,
        `;
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(query);
        return result.recordset;
    } catch (err) {
        console.error('SQL query failed:', err);
        throw err;
    }
}
async function displayingAdminManageSupplies(response){
    let query1;
    /* YOU NEED TO JOIN THIS */
    query1 = `
        SELECT 
            su.supplyID AS Supply ID,
            su.name AS Supply Name,
            o.name AS Office Name,
        FROM
            dbo.supplies AS su,
            dbo.offices AS o,
        ORDER BY o.name DESC,
        `;
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(query);
        return result.recordset;
    } catch (err) {
        console.error('SQL query failed:', err);
        throw err;
    }
}
async function displayingManagerManageTrucks(response){
    let query1;
    /* YOU NEED TO JOIN THIS */
    query1 = `
        SELECT 
            tr.licensePlate AS LicensePlate,
            tr.currDriver AS Driver,
            tr.truckCreatedOn AS Creation Date,
        FROM
            dbo.truck AS tr
        WHERE
            tr.OID = @officeID,
            tr.isDeleted = false,
        ORDER BY tr.truckCreatedOn DESC,
        `;
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(query);
        return result.recordset;
    } catch (err) {
        console.error('SQL query failed:', err);
        throw err;
    }
}
async function displayingAdminManageTrucks(response){
    let query1;
    /* YOU NEED TO JOIN THIS */
    query1 = `
        SELECT 
            tr.licensePlate AS LicensePlate,
            tr.currDriver AS Driver,
            o.name AS Office Name,
        FROM
            dbo.truck AS tr,
            dbo.offices AS o,
        ORDER BY o.name DESC,
        `;
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(query);
        return result.recordset;
    } catch (err) {
        console.error('SQL query failed:', err);
        throw err;
    }
}
async function displayingAdminManageOffices(response){
    let query1;
    /* YOU NEED TO JOIN THIS */
    query1 = `
        SELECT 
            o.OID AS Office ID,
            o.name AS Office Name,
            o.officeAddress AS Address,
            o.managerName AS Manager Name,
        FROM
            dbo.supplies AS su,
            dbo.offices AS o,
        ORDER BY o.name DESC,
        `;
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(query);
        return result.recordset;
    } catch (err) {
        console.error('SQL query failed:', err);
        throw err;
    }
}

module.exports = {
    displayingCustomerPackages,
    displayingEmployeePackages,
    displayingManagerPackages
}
exports.loginverify = loginverify;
exports.displayingCustomerPackages(reponse)
exports.displayingEmployeePackages(reponse)
exports.displayingManagerPackages(reponse)
