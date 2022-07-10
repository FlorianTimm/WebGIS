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
    private sliderAusrichtung: HTMLInputElement;
    private sliderAuflösung: HTMLInputElement;
    private sliderUeberlappungLaengs: HTMLInputElement;
    private sliderUeberlappungQuer: HTMLInputElement;
    private uavSelect: HTMLSelectElementArray<UAV>;


    constructor(map: Map, div?: HTMLElement,) {
        super(div);
        this.map = map;

        this.source = new VectorSource({})
        let layer = new VectorLayer({ source: this.source })
        this.map.addLayer(layer)

        this.uavSelect = HTML.createSelect(this.getDiv(), "UAV", UAV.getUAVs());
        this.buttonZeichnen = HTML.createButton(this.getDiv(), "Gebiet zeichnen");
        this.sliderAusrichtung = HTML.createSlider(this.getDiv(), "Ausrichtung", 0, 360, 0, 10);
        this.sliderAuflösung = HTML.createSlider(this.getDiv(), "Auflösung [cm/px]", 0, 10, 2, 0.5);
        this.sliderUeberlappungLaengs = HTML.createSlider(this.getDiv(), "Überlappung längs [%]", 0, 90, 50, 5);
        this.sliderUeberlappungQuer = HTML.createSlider(this.getDiv(), "Überlappung quer [%]", 0, 90, 50, 5);

        new Zeichnen(this.map, {
            button: this.buttonZeichnen,
            ausrichtung: this.sliderAusrichtung,
            ueberlappungLaengs: this.sliderUeberlappungLaengs,
            ueberlappungQuer: this.sliderUeberlappungQuer,
            aufloesung: this.sliderAuflösung,
            uav: this.uavSelect
        });
    }

    public getName(): string {
        return "Hauptmenü";
    }

    public getColor(): Color {
        return [200, 200, 0]
    }

}