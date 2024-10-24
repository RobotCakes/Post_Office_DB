var fs = require('fs');
var sql = require('mssql');
var config = require('./db_connect');
var querystring = require('querystring');

// -------------------------------- ADMIN -------------------------------------------//
function AdminIncomeBasedOnPayment(response, postData) {

}
function AdminIncomeBasedOnPackage(response, postData) {


}
function AdminTotalPacketsIncomingNOutgoing(response, postData) {


}
function AdminTotalSuppliesSold(response, postData) {


}
function AdminTotalMishaps(response, postData){

}
function AdminTotalPackagesDeleted(response, postData){
    
}

// -------------------------------- MANAGER -------------------------------------------//

function ManagerIncomeBasedOnPayment(response, postData) {

}
function ManagerIncomeBasedOnPackage(response, postData) {


}
function ManagerTotalPacketsIncomingNOutgoing(response, postData) {


}
function ManagerTotalSuppliesSold(response, postData) {


}
function ManagerTotalMishaps(response, postData){

}
function ManagerEmployeeWorkload(response, postData){

}
function ManagerTotalPackagesDeleted(response, postData){
    
}
// Admin // 
exports.AdminIncomeBasedOnPayment = AdminIncomeBasedOnPayment;
exports.AdminIncomeBasedOnPackage = AdminIncomeBasedOnPackage;
exports.AdminTotalPacketsIncomingNOutgoing = AdminTotalPacketsIncomingNOutgoing;
exports.AdminTotalSuppliesSold = AdminTotalSuppliesSold;
exports.AdminTotalMishaps = AdminTotalMishaps;
exports.AdminTotalPackagesDeleted = AdminTotalPackagesDeleted;

// Manager //
exports.ManagerIncomeBasedOnPayment = ManagerIncomeBasedOnPayment;
exports.ManagerIncomeBasedOnPackage = ManagerIncomeBasedOnPackage;
exports.ManagerTotalPacketsIncomingNOutgoing = ManagerTotalPacketsIncomingNOutgoing;
exports.ManagerTotalSuppliesSold = ManagerTotalSuppliesSold;
exports.ManagerTotalMishaps = ManagerTotalMishaps;
exports.ManagerEmployeeWorkload = ManagerEmployeeWorkload;
exports.ManagerTotalPackagesDeleted = ManagerTotalPackagesDeleted;