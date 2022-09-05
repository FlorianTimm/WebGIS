import { Color } from "ol/color";
import Map from "../Map";
import HTML from "./HTML";
import Menu from "./Menu";
import VectorTileSource from "ol/source/VectorTile";
import Zeichnen from "./Zeichnen";
//import { feature, point, lineString, booleanDisjoint  } from "@turf/turf";
//import { Point, LineString } from "ol/geom";

export default class GenehmigungMenu extends Menu {
    private _flugverbotVectorTilesSource: VectorTileSource | null
    private _zeichnen: Zeichnen;
    private _table: HTMLTableElement;

    constructor(map: Map, zeichnen: Zeichnen) {
        super();
        let div = this.getDiv();
        this._zeichnen = zeichnen;
        this._flugverbotVectorTilesSource = map.getFlugverbotVectorTiles().getSource()

        let buttonCheck = HTML.createButton(div, "Prüfen");
        buttonCheck.addEventListener('click', () => this.buttonClicked())

        this._table = document.createElement('table');
        div.appendChild(this._table);
    }

    public getName(): string {
        return "Genehmigung"
    }
    public getColor(): Color {
        return [250, 100, 100]
    }

    private buttonClicked() {

        let liste: string[] = [];
        this._table.innerHTML = '';

        let gebiet = this._zeichnen.gebiet;
        let extent = gebiet?.getGeometry()?.getExtent();
        if (extent === undefined) {
            alert("Kein Gebiet festgelegt!")
            return;
        }
        //let turfGebiet = feature(gebiet)


        let features = this._flugverbotVectorTilesSource?.getFeaturesInExtent(extent);
        features?.forEach((f) => {
            let klasse = f.get('klasse');
            /*console.log(f)
            //let turfGeom = feature(f);
            //
            let geom = f.getGeometry();
            if (!geom) return;

            let turfGeom
            if (geom.getType() == 'Point')
                turfGeom = point((<Point>geom).getCoordinates());
            else if (geom.getType() == 'LineString')
                turfGeom = lineString((<LineString>geom).getCoordinates());
            else if (geom.getType() == 'Polygon')
                turfGeom = polygon((<Polygon>geom).getCoordinates());

            console.log(turfGebiet, turfGeom)
            if (turfGeom || turfGeom && booleanDisjoint(turfGebiet, turfGeom)) return;*/
            if (!liste.includes(klasse))
                liste.push(klasse)
        })


        liste.forEach((e) => {
            let tr = document.createElement('tr');
            let td = document.createElement('td');
            td.innerHTML = e;
            tr.appendChild(td);
            this._table.appendChild(tr);
        });


    }

}
