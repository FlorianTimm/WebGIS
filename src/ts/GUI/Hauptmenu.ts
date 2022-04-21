import Menu from "./Menu";
import HTML from "./HTML"
import Map from "../Map";
import Draw from 'ol/interaction/Draw';
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import Zeichnen from "./Zeichnen";

export default class Hauptmenu extends Menu {
    private map: Map;
    private buttonZeichnen: HTMLButtonElement;
    private source: VectorSource

    constructor(div: HTMLElement, map: Map) {
        super(div);
        this.map = map;

        this.source = new VectorSource({})
        let layer = new VectorLayer({ source: this.source })
        this.map.addLayer(layer)

        new Zeichnen(this.map, this.buttonZeichnen);

    }

    protected create(): void {
        this.div.innerHTML = "";
        this.buttonZeichnen = HTML.createButton(this.div, "Gebiet zeichnen")

    }



}