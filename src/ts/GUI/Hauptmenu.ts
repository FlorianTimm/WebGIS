import Menu from "./Menu";
import HTML, { HTMLSelectElementArray } from "./HTML"
import Map from "../Map";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import Zeichnen from "./Zeichnen";
import UAV from "../UAV";
import { Color } from "ol/color";

export default class Hauptmenu extends Menu {
    private _map: Map;
    private _buttonZeichnen: HTMLButtonElement;
    private _source: VectorSource
    private _sliderAusrichtung: HTMLInputElement;
    private _sliderAuflösung: HTMLInputElement;
    private _sliderUeberlappungLaengs: HTMLInputElement;
    private _sliderUeberlappungQuer: HTMLInputElement;
    private uavSelect: HTMLSelectElementArray<UAV>;
    private _hoeheBegrenzen: HTMLInputElement;
    private _flugHoehe: HTMLInputElement;
    private _flugLaenge: HTMLInputElement;
    private _flugDauer: HTMLInputElement;
    private _bildAnzahl: HTMLInputElement;


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