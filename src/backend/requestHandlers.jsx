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

async function displayingCustomerPackages(response){
    /**/ 
}
async function displayingEmployeePackages(response){
    /**/
}
async function displayingAdminPackages(response){
    /**/
}
module.exports = {
    displayingPackages
}
exports.loginverify = loginverify;
exports.displayingPackages(reponse)