import Menu from "./Menu";
import Map from "../Map";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import Zeichnen from "./Zeichnen";
import { Color } from "ol/color";

export default class Hauptmenu extends Menu {
    private _map: Map;
    private _source: VectorSource
    constructor(map: Map, div?: HTMLElement,) {
        super(div);
        this._map = map;

        this._source = new VectorSource({})
        let layer = new VectorLayer({ source: this._source })
        this._map.addLayer(layer)


        new Zeichnen(this._map, this.getDiv());
    }

    public getName(): string {
        return "Hauptmenü";
    }

    public getColor(): Color {
        return [200, 200, 0]
    }

}