import express from "express";
import sqlite3 from "sqlite3";
import { v4 as uuidv4 } from 'uuid';

// Datenbank einrichten
let db = new sqlite3.Database("database.db");
db.exec("DROP TABLE IF EXISTS projekt");
db.exec("DROP TABLE IF EXISTS uav");
db.exec("CREATE TABLE IF NOT EXISTS uav(id INTEGER PRIMARY KEY AUTOINCREMENT, name text, focuslength real, sensorwidth real, sensorheight real, sensorpixelwidth real, sensorpixelheight real, minspeed real, maxspeed real, curveRadius real);");
db.exec("CREATE TABLE IF NOT EXISTS projekt(id INTEGER PRIMARY KEY AUTOINCREMENT, projekt text unique, gebiet text, uav integer REFERENCES uav(id), aufloesung integer, ueberlappunglaengs real, ueberlappungquer real, ausrichtung integer); ");
db.exec("INSERT INTO uav VALUES (1,'DJI Mini 3 Pro', 0.00665, 0.009846, 0.007153, 8064, 6048, 0, 50, 10);")
db.exec("INSERT INTO uav VALUES (2,'Maginon QC-707SE (Aldi)', 0.00665, 0.009846, 0.007153, 1208, 720, 0, 50, 10);")
db.exec("INSERT INTO uav VALUES (3,'Leica DMC III', 0.092, 0.1003392, 0.0569088, 25728, 14592, 0, 50, 10);")
db.exec("INSERT INTO projekt (projekt, gebiet, uav, ueberlappunglaengs, ueberlappungquer, ausrichtung, aufloesung) VALUES ('test', 'POLYGON((1109978.6465459517 7065454.731937807,1110001.2252990762 7066459.486451852,1110497.9578678177 7066978.797773719,1111130.1629553067 7066877.193384658,1111407.8611384388 7065845.2214850625,1111035.3117118822 7064467.917544465,1110516.0003900162 7064106.6574944705,1110041.8465743996 7064309.866272592,1109978.6465459517 7065454.731937807))', 1, 0.5, 0.5, 90, 0.1);")


let app = (0, express)();
app.use(express.json());

// Hallo sagen
app.get("/", function (req, res) {
    res.send("Moin!");
})

// UAVs
app.get("/uav", function (req, res) {
    db.all("SELECT * FROM uav;", (_, rows) => {
        res.send(rows);
    });
})

// Projekt
app.get("/projekt/:projekt", function (req, res) {
    const stmt = db.prepare("SELECT * FROM projekt WHERE projekt = ?");
    stmt.get(req.params.projekt, (_, row) => {
        res.send(row);
        console.log(row)
    });
})

// Neu
app.post("/projekt", function (req, res) {
    const stmt = db.prepare("INSERT INTO projekt(projekt, gebiet, uav, ueberlappunglaengs, ueberlappungquer, ausrichtung, aufloesung) VALUES (?,?,?,?,?,?,?);");
    console.log(req.body)
    let uuid = uuidv4();
    stmt.get([
        uuid,
        req.body.gebiet,
        req.body.uav,
        req.body.ueberlappungLaengs,
        req.body.ueberlappungQuer,
        req.body.ausrichtung,
        req.body.aufloesung
    ], (error, row) => {
        if (error) {
            if (error.code == 'SQLITE_CONSTRAINT')
                res.sendStatus(409);
            else
                res.sendStatus(501);
        } else {
            //res.sendStatus(201);
            res.status(201).send({ projekt: uuid })
        }
    });
})

// Ändern
app.put("/projekt/:projekt", function (req, res) {
    const stmt = db.prepare("UPDATE projekt SET gebiet = ?, uav = ?, ueberlappunglaengs = ?, ueberlappungquer = ?, ausrichtung = ?, aufloesung = ? WHERE projekt = ?;");
    console.log(req.body)
    stmt.get([
        req.body.gebiet,
        req.body.uav,
        req.body.ueberlappungLaengs,
        req.body.ueberlappungQuer,
        req.body.ausrichtung,
        req.body.aufloesung,
        req.params.projekt
    ], (error, row) => {
        if (error) {
            if (error.code == 'SQLITE_CONSTRAINT')
                res.sendStatus(409);
            else
                res.sendStatus(501);
        } else {
            res.status(201).send({ projekt: req.params.projekt })
        }
    });
})

// Server starten
app.listen(3000, function () {
    console.log("server is running on port 3000");
});
