function UpdateCustomer(response, postData){
    sql.connect(config).then(function () {
        var req = new sql.Request();

        var querystring = require('querystring');
        var data = querystring.parse(postData);

        var UserID = data.UID;
        var NameID = data.nameID;
        var name = data.name;
        var address = data.address;
        var firstName = data.firstName;
        var middleI = data.middleInitial;
        var lastName = data.lastName;
        var address = data.address;
        var username = data.username;
        var password = data.password;
        var phoneNumber = data.phoneNumber;
        var email = data.email;

        console.log(UserID);
        console.log(firstName);
        console.log(middleI);
        console.log(lastName);
        console.log(address);
        console.log(username);
        console.log(password);
        console.log(phoneNumber);
        console.log(email);

        // const columnNames = ["UID","username", "password", "phoneNumber", "email", "updatedAt"];
        // NOT WORKING // 
        var query = "UPDATE dbo.Customer SET Customer.username = '" + username +"', Customer.password = '" + password + "', Customer.phoneNumber = '" + phoneNumber + "', Customer.email = '" + email + "' WHERE UID = '" + UID + "';";
        var secondquery = "UPDATE dbo.names SET firstName = '" + firstName + "', middleInitial = '" + middleI  + "', lastName = '" + lastName + "'  WHERE Customer.'" + name + "' = names.'" + NameID + "';";

        req.query(query).then(function(recordset) {
            console.log("First query executed");
            req.query(secondquery).then(function(recordset) {
            response.write("Faculty Modified");
            response.end();}
        )});



    })}
exports.UpdateCustomer = UpdateCustomer;
