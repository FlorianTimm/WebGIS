import { Feature } from "ol";
import { LineString, Point, Polygon } from "ol/geom";
import Map from "./Map";
import { polygon, lineString, lineIntersect, toWgs84, buffer, length as turfLength, along, toMercator, destination, length, distance, Position } from "@turf/turf";
import UAV from "./UAV";
import * as math from 'mathjs';
import { abs } from "mathjs";

export default class TrajectoryCalc {
    private _map: Map;
    private _gebiet: Polygon | undefined;
    private _ausrichtung: number = 0;
    private _ueberlappungQuer: number = 0.50;
    private _ueberlappungLaengs: number = 0.50;
    private _aufloesung: number = 0.1;
    private _distanceQuer: number = 100;
    private _distanceLaengs: number = 100;
    private _uav: UAV | undefined;
    private _hoeheBegrenzen: boolean = false;
    private _callback: (hoehe: number, laenge: number, dauer: number, anzahl: number) => void;
    private _flughoehe: number = 100;


    constructor(map: Map, callback: (hoehe: number, laenge: number, dauer: number, anzahl: number) => void) {
        this._map = map;
        this._callback = callback;
    }

    private calculateDistance(): boolean {
        if (this._uav === undefined) return false;
        if (this._ueberlappungLaengs === undefined) return false;
        if (this._ueberlappungQuer === undefined) return false;
        if (this._aufloesung === undefined) return false;

        const pixelGroesse = this._uav.sensorSize[0] / this._uav.sensorPixel[0];
        this._flughoehe = this._uav.focusLength / pixelGroesse * this.aufloesung;
        if (this._hoeheBegrenzen && this._flughoehe > 120) this._flughoehe = 120;
        const bildGroesseBoden: [number, number] = [this._uav.sensorSize[1] / this._uav.focusLength * this._flughoehe, this._uav.sensorSize[0] / this._uav.focusLength * this._flughoehe]
        this._distanceLaengs = bildGroesseBoden[1] * (1 - this._ueberlappungLaengs)
        this._distanceQuer = bildGroesseBoden[0] * (1 - this._ueberlappungQuer)

        console.log(this._distanceQuer, this._distanceLaengs)
        return true;
    }

    private recalcTrajectory() {
        if (!this.gebiet) return;
        let geom = <Polygon>this.gebiet.simplify(5);
        let anzahlBilder = 0;
        if (!this.calculateDistance()) return;
        this._map.getTrajectorySource().clear();
        let poly4326 = <Polygon>geom.clone().transform('EPSG:3857', 'EPSG:4326');
        let buff = new Polygon(buffer(polygon(poly4326.getCoordinates()), Math.max(this._distanceQuer, this._distanceLaengs) / 1000, { units: 'kilometers', steps: 1 }).geometry.coordinates);
        //buff.transform('EPSG:4326', 'EPSG:3857');
        //this.map.getTrajectorySource().addFeature(new Feature<LineString>({ geometry: new LineString(buff.getLinearRing(0).getCoordinates()) }))
        let poly = polygon(buff.getCoordinates())

        //
        // [minx, miny, maxx, maxy]
        let extent = buff.getExtent()
        let minx = (extent[0] + extent[2]) / 2
        let miny = (extent[1] + extent[3]) / 2

        let maxStrecke = distance([extent[0], extent[1]], [extent[2], extent[3]]) / 2.

        let imgCoords: [number, number][] = []

        for (let i = Math.floor(-maxStrecke / (this._distanceQuer / 1000.)); i < Math.ceil(maxStrecke / (this._distanceQuer / 1000.)) + 1; i++) {
            let abstand = (i - 0.5) * this._distanceQuer / 1000.
            let winkel = abstand < 0 ? this.ausrichtung + 180 : this.ausrichtung;
            if (winkel > 180) winkel -= 360;
            abstand = Math.abs(abstand);

            let c0 = destination([minx, miny], abstand, winkel)
            let c1 = destination(c0, maxStrecke, this.ausrichtung < -90 ? this.ausrichtung + 270 : this._ausrichtung - 90)
            let c2 = destination(c0, maxStrecke, this.ausrichtung < 90 ? this.ausrichtung + 90 : this._ausrichtung - 270)


            console.log(c1, c2)

            let cut = lineIntersect(lineString([c1.geometry.coordinates, c2.geometry.coordinates]), poly).features

            console.log(poly, cut)

            cut.sort((a, b) => {
                for (let x = 0; x < Math.min(a.geometry.coordinates.length, b.geometry.coordinates.length); x++) {
                    let diff = a.geometry.coordinates[x] - b.geometry.coordinates[x];
                    if (diff != 0) return diff
                }
                return 0;
            });



            if (i % 2 != 0) {
                cut = cut.reverse()
            }

            let cutArray: Position[] = []
            cut.forEach((f) => {
                let c = f.geometry.coordinates
                //lineCoords.push(c);
                cutArray.push(c);
            })

            for (let j = 0; j <= cutArray.length - 1; j += 2) {
                let line = lineString([cutArray[j], cutArray[j + 1]]);
                let l = turfLength(line);
                let versatz = (l % (this._distanceLaengs / 1000)) / 2;
                for (; versatz < l; versatz += this._distanceLaengs / 1000) {
                    let p = along(line, versatz)
                    let c = toMercator(p.geometry.coordinates);
                    imgCoords.push([c[0], c[1]]);
                    this._map.getTrajectorySource().addFeature(new Feature({ geometry: new Point(c) }));
                    anzahlBilder++;
                }
            }

        }

        //let line = new LineString(lineCoords);
        //this._map.getTrajectorySource().addFeature(new Feature({ geometry: line }))
        let spline = this.createSpline(imgCoords);
        this._map.getTrajectorySource().addFeature(new Feature({ geometry: spline }))

        this._callback(this._flughoehe, turfLength(toWgs84(lineString(spline.getCoordinates()))), 0, anzahlBilder)
    }


    private createSpline(coords: [number, number][]): LineString {
        /*let ls = toWgs84(lineString(coords));
        let bs = bezierSpline(ls, {
            sharpness: 0.5
        });
        return new LineString(toMercator(bs).geometry.coordinates);
        */
        let spline: [number, number][] = [coords[0]]
        let s = 0.8
        let m = math.matrix([
            [0, 1, 0, 0],
            [-s, 0, s, 0],
            [2 * s, s - 3, 3 - 2 * s, -s],
            [-s, 2 - s, s - 2, s]
        ])

        for (let i = 1; i < coords.length - 2; i++) {
            let mX = math.multiply(m, [coords[i - 1][0], coords[i][0], coords[i + 1][0], coords[i + 2][0]])
            let mY = math.multiply(m, [coords[i - 1][1], coords[i][1], coords[i + 1][1], coords[i + 2][1]])
            for (let t = 0; t < 1; t += 0.1) {
                let x = <number><unknown>math.multiply([1, t, t ** 2, t ** 3], mX)
                let y = <number><unknown>math.multiply([1, t, t ** 2, t ** 3], mY)
                spline.push([x, y])
            }

        }
        spline.push(coords[coords.length - 1])
        return new LineString(spline);
    }


    ////////////////////////////////////
    ///// Getter/Setter

    public get gebiet(): Polygon | undefined {
        return this._gebiet;
    }
    public set gebiet(value: Polygon | undefined) {
        console.log(value)
        if (this._gebiet == value || value == undefined) return;
        this._gebiet = value.clone();
        this.recalcTrajectory();
        console.log("Neue Geometrie")
    }
    public get ausrichtung(): number {
        return this._ausrichtung;
    }
    public set ausrichtung(value: number) {
        if (this._ausrichtung == value) return;
        if (value < 0 || value > 360) {
            throw new RangeError("Winkel zwischen 0 und 360 erforderlich!");
        }
        this._ausrichtung = value;
        this.recalcTrajectory();
    }
    public get ueberlappungQuer(): number {
        return this._ueberlappungQuer;
    }
    public set ueberlappungQuer(value: number) {
        if (this._ueberlappungQuer == value) return;
        this._ueberlappungQuer = value;
        this.recalcTrajectory();
    }
    public get aufloesung(): number {
        return this._aufloesung;
    }
    public set aufloesung(value: number) {
        if (this._aufloesung == value) return;
        this._aufloesung = value;
        this.recalcTrajectory();
    }
    public get ueberlappungLaengs(): number {
        return this._ueberlappungLaengs;
    }
    public set ueberlappungLaengs(value: number) {
        if (this._ueberlappungLaengs == value) return;
        this._ueberlappungLaengs = value;
        this.recalcTrajectory();
    }

    public get uav() {
        return this._uav;
    }
    public set uav(value: UAV | undefined) {
        this._uav = value;
        this.recalcTrajectory();
    }

    public get hoeheBegrenzen() {
        return this._hoeheBegrenzen;
    }
    public set hoeheBegrenzen(value: boolean) {
        this._hoeheBegrenzen = value;
        this.recalcTrajectory();
    }
}