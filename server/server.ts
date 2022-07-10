import express from "express";
import sqlite3 from 'sqlite3';

// Setting up a database for storing data.
var db = new sqlite3.Database("database.db");
db.exec("CREATE TABLE IF NOT EXISTS hallo(id serial);");

var app = express();

// Handles whenever the root directory of the website is accessed.
app.get("/", function (req, res) {
    // Respond with Express
    res.send("Hello world!")
    console.log(req.headers)
});

// Set app to listen on port 3000
app.listen(3000, function () {
    console.log("server is running on port 3000");
});