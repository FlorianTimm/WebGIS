import { Feature } from "ol";
import { LineString, Polygon } from "ol/geom";
import Map from "./Map";
import { polygon, lineString, bezierSpline, lineIntersect, pointToLineDistance, point as turfPoint } from "@turf/turf";
import { transform } from "ol/proj";
import { distance } from "ol/coordinate";

export default class TrajectoryCalc {
    private map: Map;
    constructor(map: Map) {
        this.map = map;
    }

    recalcTrajectory(polygonGeom: Feature<Polygon>, ausrichtung: number) {
        let geom = <Polygon>polygonGeom.getGeometry().simplify(5);

        let traj = this.getLongestEdge(geom);
        let poly = polygon(geom.getCoordinates())
        this.map.getTrajectorySource().clear();
        //this.map.getTrajectorySource().addFeature(new Feature({ geometry: traj }))

        let maxd = 0;
        let ls4326 = <LineString>traj.clone().transform('EPSG:3857', 'EPSG:4326');
        let ls = lineString(ls4326.getCoordinates());
        console.log(ls);
        let poly4326 = <Polygon>polygonGeom.getGeometry().clone().transform('EPSG:3857', 'EPSG:4326');
        poly4326.getCoordinates()[0].forEach((p) => {
            let point = turfPoint(p);
            console.log(point);
            let d = pointToLineDistance(point, ls, { units: 'meters' })
            console.log(d);
            if (d > maxd) maxd = d;
        })

        console.log(maxd);
        const distance = 10 * ausrichtung + 1;

        let coords = [];
        let grenze = Math.ceil(maxd / distance) * distance;
        for (let i = -grenze; i <= grenze; i += distance) {
            let line = this.createParallelLine(traj, i);
            let is = lineIntersect(lineString(line.getCoordinates()), poly).features;
            let coord = []
            is.forEach((feature) => {
                coord.push(feature.geometry.coordinates);
            });
            if (i <= 0) coord.reverse();
            if (i % (2 * distance) == 0) coord.reverse();
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
}