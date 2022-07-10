import { Feature } from "ol";
import { LineString, Polygon } from "ol/geom";
import Map from "./Map";
import { polygon, lineString, bezierSpline, lineIntersect, pointToLineDistance, point as turfPoint } from "@turf/turf";
import UAV from "./UAV";
import { distance } from "ol/coordinate";

export default class TrajectoryCalc {
    private map: Map;
    private _gebiet: Feature<Polygon>;
    private _ausrichtung: number = 0;
    private _ueberlappungQuer: number = 50;
    private _ueberlappungLaengs: number = 50;
    private _aufloesung: number = 5;
    private _distanceQuer: number;
    private _distanceLaengs: number;
    private _uav: UAV;


    constructor(map: Map) {
        this.map = map;
    }

    private calculateDistance(): boolean {
        if (this._uav === undefined) return false;
        if (this._ueberlappungLaengs === undefined) return false;
        if (this._ueberlappungQuer === undefined) return false;
        if (this._aufloesung === undefined) return false;

        this._distanceQuer = 100;
        this._distanceLaengs = 100;
        const pixelGroesse = this._uav.sensorSize[0] / this._uav.sensorPixel[0];
        const flughoehe = this._uav.focusLength / pixelGroesse * this.aufloesung
        const bildGroesseBoden: [number, number] = [this._uav.sensorSize[0] / this._uav.focusLength * flughoehe, this._uav.sensorSize[1] / this._uav.focusLength * flughoehe]
        this._distanceLaengs = bildGroesseBoden[0] * (1 - this._ueberlappungLaengs)
        this._distanceQuer = bildGroesseBoden[1] * (1 - this._ueberlappungQuer)

        console.log("Bodenauflösung", this._aufloesung);
        console.log("pixelGroesse", pixelGroesse);
        console.log("flughoehe", flughoehe);
        console.log("bildGroesse", bildGroesseBoden);
        return true;
    }

    recalcTrajectory() {

        let geom = <Polygon>this.gebiet.getGeometry().simplify(5);
        if (!this.calculateDistance()) return;
        let traj = this.getLongestEdge(geom);
        let poly = polygon(geom.getCoordinates())
        this.map.getTrajectorySource().clear();
        //this.map.getTrajectorySource().addFeature(new Feature({ geometry: traj }))

        let maxd = 0;
        let ls4326 = <LineString>traj.clone().transform('EPSG:3857', 'EPSG:4326');
        let ls = lineString(ls4326.getCoordinates());
        console.log(ls);
        let poly4326 = <Polygon>this.gebiet.getGeometry().clone().transform('EPSG:3857', 'EPSG:4326');
        poly4326.getCoordinates()[0].forEach((p) => {
            let point = turfPoint(p);
            console.log(point);
            let d = pointToLineDistance(point, ls, { units: 'meters' })
            console.log(d);
            if (d > maxd) maxd = d;
        })

        console.log(maxd);
        let coords = [];
        let grenze = Math.ceil(maxd / this._distanceQuer) * this._distanceQuer;
        for (let i = -grenze; i <= grenze; i += this._distanceQuer) {
            let line = this.createParallelLine(traj, i);
            let is = lineIntersect(lineString(line.getCoordinates()), poly).features;
            let coord = []
            is.forEach((feature) => {
                coord.push(feature.geometry.coordinates);
            });
            if (i <= 0) coord.reverse();
            if (i % (2 * this._distanceQuer) == 0) coord.reverse();
            coords.push(...coord);
        }
        console.log(coords)
        let line = new LineString(coords);
        this.map.getTrajectorySource().addFeature(new Feature({ geometry: line }))
        //let spline = this.createSpline(line);
        //this.map.getTrajectorySource().addFeature(new Feature({ geometry: spline }))
    }

    private getLongestEdge(geom: Polygon) {
        let coord = geom.getCoordinates()[0];
        let longestEdgeLen = 0;
        let longestEdge: LineString;
        coord.forEach((coord1) => {
            coord.forEach((coord2) => {
                if (coord1 == coord2) return;
                let ls = new LineString([coord1, coord2]);
                let len = ls.getLength()
                if (longestEdgeLen < len) {
                    longestEdgeLen = len;
                    longestEdge = ls;
                }
            })
        })
        console.log(longestEdgeLen);
        return longestEdge;
    }

    private getNormalVector(geom: LineString) {
        let a = geom.getFirstCoordinate();
        let b = geom.getLastCoordinate();

        let dx = a[0] - b[0];
        let dy = a[1] - b[1];

        let len = Math.sqrt(dx * dx + dy * dy);

        return [dy / len, -dx / len];
    }

    private createParallelLine(geom: LineString, distance: number, samedirection = true) {
        let newgeom = [];
        let normal = this.getNormalVector(geom);
        geom.getCoordinates().forEach((point) => {
            let x = point[0] + normal[0] * distance;
            let y = point[1] + normal[1] * distance;
            newgeom.push([x, y]);
        })
        if (!samedirection) newgeom.reverse();
        //console.log(newgeom);
        return new LineString(newgeom);
    }

    private createSpline(geom: LineString) {
        let ls = lineString(geom.getCoordinates());
        let bs = bezierSpline(ls, { sharpness: 0.5 });
        return new LineString(bs.geometry.coordinates);
    }



    ////////////////////////////////////
    ///// Getter/Setter

    public get gebiet(): Feature<Polygon> {
        return this._gebiet;
    }
    public set gebiet(value: Feature<Polygon>) {
        if (this._gebiet == value) return;
        this._gebiet = value;
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
    public set uav(value: UAV) {
        this._uav = value;
        this.recalcTrajectory();
    }
}