import { Color } from "ol/color";
import Map from "../openLayers/Map";
import HTML from "./HTML";
import Menu from "./Menu";
import VectorTileSource from "ol/source/VectorTile";
import Zeichnen from "./Zeichnen";
import { FlugverbotVectorTiles } from "../openLayers/FlugverbotLayer";

export default class GenehmigungMenu extends Menu {
    private flugverbotVectorTilesSource: VectorTileSource | null
    private zeichnen: Zeichnen;
    private resultsDiv: HTMLDivElement;
    private map: Map;
    private buttonCheck: HTMLInputElement;

    constructor(map: Map, zeichnen: Zeichnen) {
        super();
        let div = this.div;
        this.zeichnen = zeichnen;

        this.flugverbotVectorTilesSource = map.flugverbotVectorTiles.getSource();
        this.map = map;

        this.buttonCheck = HTML.createButton(div, "Prüfen");
        this.buttonCheck.addEventListener('click', () => this.buttonClicked())

        this.resultsDiv = document.createElement('div');
        div.appendChild(this.resultsDiv);

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
        let gebiet = this.zeichnen.gebiet;
        let extent = gebiet?.getGeometry()?.getExtent();
        if (!extent) {
            alert("Kein Gebiet festgelegt!")
            return;
        }

        this.resultsDiv.innerHTML = 'Lädt...';
        //let turfGebiet = feature(gebiet)


        this.map.getView().fit(extent, {
            callback: () => {
                if (this.map.getView().getZoom() ?? 0 < 12)
                    this.map.getView().setZoom(12);
            }
        });
        this.map.once('rendercomplete', () => {

            this.resultsDiv.innerHTML = '';
            let liste: { [key: string]: string } = {};

            //this.flugverbotVectorTilesSource?.on('tileloadend', console.log)
            if (!extent) {
                alert("Kein Gebiet festgelegt!")
                return;
            }
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
                let entryDiv = document.createElement('div');
                let h5 = document.createElement('h4');
                h5.innerHTML = key
                let txt = document.createTextNode(e ?? '')
                entryDiv.appendChild(h5);
                entryDiv.appendChild(txt);
                this.resultsDiv.appendChild(entryDiv);


                entryDiv.addEventListener('mouseover', () => {
                    FlugverbotVectorTiles.selection = key;
                    this.flugverbotVectorTilesSource?.changed();
                });
            };

        })
    }

    public activated(): void {
        let gebiet = this.zeichnen.gebiet;
        let extent = gebiet?.getGeometry()?.getExtent();
        if (!extent) {
            this.buttonCheck.disabled = true;
        } else {
            this.buttonCheck.disabled = false;
        }
    }

}
