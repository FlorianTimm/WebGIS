import express from "express";
import sqlite3 from "sqlite3";

// Datenbank einrichten
let db = new sqlite3.Database("database.db");
db.exec("DROP TABLE IF EXISTS projekt");
db.exec("DROP TABLE IF EXISTS uav");
db.exec("CREATE TABLE IF NOT EXISTS uav(id serial primary key, name text, focuslength real, sensorwidth real, sensorheight real, sensorpixelwidth real, sensorpixelheight real, minspeed real, maxspeed real, curveRadius real);");
db.exec("CREATE TABLE IF NOT EXISTS projekt(id serial primary key, link text, gebiet text, uav integer REFERENCES uav(id)); ");
db.exec("INSERT INTO uav VALUES (1,'DJI Mini 3 Pro', 0.00665, 0.009846, 0.007153, 8064, 6048, 0, 50, 10);")
db.exec("INSERT INTO uav VALUES (2,'Maginon QC-707SE (Aldi)', 0.00665, 0.009846, 0.007153, 1208, 720, 0, 50, 10);")
db.exec("INSERT INTO uav VALUES (3,'Leica DMC III', 0.092, 0.1003392, 0.0569088, 25728, 14592, 0, 50, 10);")

let app = (0, express)();

// Hallo sagen
app.get("/", function (req, res) {
    res.send("Moin!");
})

// Hallo sagen
app.get("/uav", function (req, res) {
    db.all("SELECT * FROM uav;", (_, rows) => {
        res.send(rows);
        console.log(rows)
    });
})

// Server starten
app.listen(3000, function () {
    console.log("server is running on port 3000");
});
