import Menu from "./Menu";
import HTML, { HTMLSelectElementArray } from "./HTML"
import Map from "../Map";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import Zeichnen from "./Zeichnen";
import UAV from "../UAV";
import { Color } from "ol/color";

export default class Hauptmenu extends Menu {
    private map: Map;
    private buttonZeichnen: HTMLButtonElement;
    private source: VectorSource
    private uavSelect: HTMLSelectElementArray<UAV>;

    constructor(map: Map, div?: HTMLElement,) {
        super(div);
        this.map = map;

        this.source = new VectorSource({})
        let layer = new VectorLayer({ source: this.source })
        this.map.addLayer(layer)

        this.uavSelect = HTML.createSelect(this.getDiv(), "UAV", [new UAV("Test-UAV", 50, 100, 50, 10)]);
        this.buttonZeichnen = HTML.createButton(this.getDiv(), "Gebiet zeichnen");

        new Zeichnen(this.map, this.buttonZeichnen);
    }

    public getName(): string {
        return "Hauptmenü";
    }

    public getColor(): Color {
        return [200, 200, 0]
    }

}