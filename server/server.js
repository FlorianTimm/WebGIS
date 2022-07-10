"use strict";
exports.__esModule = true;
var express_1 = require("express");
var sqlite3_1 = require("sqlite3");
// Setting up a database for storing data.
var db = new sqlite3_1["default"].Database("database.db");
db.exec("CREATE TABLE IF NOT EXISTS hallo(id serial);");
var app = (0, express_1["default"])();
// Handles whenever the root directory of the website is accessed.
app.get("/", function (req, res) {
    // Respond with Express
    res.send("Hello world!");
    res.send(req.headers);
});
// Set app to listen on port 3000
app.listen(3000, function () {
    console.log("server is running on port 3000");
});
