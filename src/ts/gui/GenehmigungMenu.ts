import { Color } from "ol/color";
import Map from "../openLayers/Map";
import HTML from "./HTML";
import Menu from "./Menu";
import VectorTileSource from "ol/source/VectorTile";
import Zeichnen from "../control/Zeichnen";
import { FlugverbotVectorTiles } from "../openLayers/FlugverbotLayer";

export default class GenehmigungMenu extends Menu {
    private flugverbotVectorTilesSource: VectorTileSource | null
    private zeichnen: Zeichnen;
    private table: HTMLTableElement;

    constructor(map: Map, zeichnen: Zeichnen) {
        super();
        let div = this.div;
        this.zeichnen = zeichnen;

        this.flugverbotVectorTilesSource = map.flugverbotVectorTiles.getSource();

        let buttonCheck = HTML.createButton(div, "Prüfen");
        buttonCheck.addEventListener('click', () => this.buttonClicked())

        this.table = document.createElement('table');
        div.appendChild(this.table);

        div.addEventListener('mouseleave', () => {
            FlugverbotVectorTiles.selection = undefined;
            this.flugverbotVectorTilesSource?.changed();
        });
    }

    public get name(): string {
        return "Genehmigung"
    }
    public get color(): Color {
        return [250, 100, 100]
    }

    private buttonClicked() {

        let liste: { [key: string]: string } = {};
        this.table.innerHTML = '';

        let gebiet = this.zeichnen.gebiet;
        let extent = gebiet?.getGeometry()?.getExtent();
        if (extent === undefined) {
            alert("Kein Gebiet festgelegt!")
            return;
        }
        //let turfGebiet = feature(gebiet)


        let features = this.flugverbotVectorTilesSource?.getFeaturesInExtent(extent);
        features?.forEach((f) => {
            //let klasse = f.get('klasse');

            let verbot = FlugverbotVectorTiles.featureFilter(f)
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
            if (verbot.title == '') {
                return;
            }

            if (!(verbot.title in liste)) {
                liste[verbot.title] = verbot.text ?? ''
            }

        })
        for (const [key, e] of Object.entries(liste)) {
            let tr = document.createElement('tr');
            let td = document.createElement('td');
            let h5 = document.createElement('h4');
            h5.innerHTML = key
            let txt = document.createTextNode(e ?? '')
            td.appendChild(h5);
            td.appendChild(txt);
            tr.appendChild(td);
            this.table.appendChild(tr);


            td.addEventListener('mouseover', () => {
                FlugverbotVectorTiles.selection = key;
                this.flugverbotVectorTilesSource?.changed();
            });
        };


    }

}
