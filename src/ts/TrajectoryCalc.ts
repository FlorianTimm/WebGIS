import { Feature } from "ol";
import { linearFindNearest } from "ol/array";
import { LineString, Polygon } from "ol/geom";
import { fromExtent } from "ol/geom/Polygon";
import { create } from "ol/transform";
import Map from "./Map";
import { intersect } from "@turf/turf";
import GeoJSON from 'ol/format/GeoJSON';

export default class TrajectoryCalc {
    private map: Map;
    constructor(map: Map) {
        this.map = map;
    }

    recalcTrajectory(polygon: Feature<Polygon>) {
        let geom = <Polygon>polygon.getGeometry().simplify(5);
        const format = new GeoJSON();
        const turfPoly = format.writeFeatureObject(polygon);
        let traj = this.getLongestEdge(geom);

        this.map.getTrajectorySource().clear();
        this.map.getTrajectorySource().addFeature(new Feature({ geometry: traj }))

        for (let i = 1000; i < 5000; i += 1000) {
            let line = this.createParallelLine(traj, i);
            this.map.getTrajectorySource().addFeature(new Feature({ geometry: line }))
        }
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

    getNormalVector(geom: LineString) {
        let a = geom.getFirstCoordinate();
        let b = geom.getLastCoordinate();

        let dx = a[0] - b[0];
        let dy = a[1] - b[1];

        let len = Math.sqrt(dx * dx + dy * dy);

        return [dy / len, -dx / len];
    }

    createParallelLine(geom: LineString, distance: number) {
        let newgeom = [];
        let normal = this.getNormalVector(geom);
        geom.getCoordinates().forEach((point) => {
            let x = point[0] + normal[0] * distance;
            let y = point[1] + normal[1] * distance;
            newgeom.push([x, y]);
        })
        console.log(newgeom);
        return new LineString(newgeom);
    }
}