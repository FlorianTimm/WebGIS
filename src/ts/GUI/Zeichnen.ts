import { Feature } from "ol";
import { Polygon } from "ol/geom";
import { Draw } from "ol/interaction";
import { DrawEvent } from "ol/interaction/Draw";
import Map from "../Map";
import TrajectoryCalc from "../TrajectoryCalc";
import UAV from "../UAV";
import HTML, { HTMLSelectElementArray } from "./HTML";

export default class Zeichnen extends Draw {
    private _button: HTMLButtonElement;
    private _ausrichtungSlider: HTMLInputElement;
    private _map: Map;
    private _tc: TrajectoryCalc;
    private _gebiet: Feature<Polygon>;
    private _ueberlappungLaengsSlider: HTMLInputElement;
    private _ueberlappungQuerSlider: HTMLInputElement;
    private _aufloesungSlider: HTMLInputElement;
    private _uavSelect: HTMLSelectElementArray<UAV>;
    private _hoeheBegrenzen: HTMLInputElement;
    private _flugHoeheInput: HTMLInputElement;
    private _flugLaengeInput: HTMLInputElement;
    private _flugDauerInput: HTMLInputElement;
    private _bildAnzahlInput: HTMLInputElement;

    constructor(map: Map, menuBereich: HTMLElement) {
        super({
            type: 'Polygon',
            source: map.getZeichenSource()
        });
        this._map = map;

        this._uavSelect = HTML.createSelect(menuBereich, "UAV", UAV.getUAVs());
        this._button = HTML.createButton(menuBereich, "Gebiet zeichnen");
        this._ausrichtungSlider = HTML.createSlider(menuBereich, "Ausrichtung", 0, 360, 0, 10);
        this._aufloesungSlider = HTML.createSlider(menuBereich, "Auflösung [cm/px]", 1, 20, 2, 0.5);
        this._ueberlappungLaengsSlider = HTML.createSlider(menuBereich, "Überlappung längs [%]", 0, 90, 50, 5);
        this._ueberlappungQuerSlider = HTML.createSlider(menuBereich, "Überlappung quer [%]", 0, 90, 50, 5);
        this._hoeheBegrenzen = HTML.createCheckbox(menuBereich, "100m-Begrenzung")


        this._flugHoeheInput = HTML.createInput(menuBereich, "Flughöhe", '-', true);
        this._flugLaengeInput = HTML.createInput(menuBereich, "Fluglänge", '-', true);
        this._flugDauerInput = HTML.createInput(menuBereich, "Flugdauer", '-', true);
        this._bildAnzahlInput = HTML.createInput(menuBereich, "Bilder", '-', true);


        this.on("drawend", (event: DrawEvent) => { this.zeichnen_fertig(event) })
        this.setActive(false)
        this._map.addInteraction(this)

        this._tc = new TrajectoryCalc(this._map, this.setFlightParameter.bind(this));

        this._button.addEventListener('click', () => {
            console.log("Zeichnen");
            this.button_click()
        })

        this._ausrichtungSlider.addEventListener('change', this.ausrichtungUebergeben.bind(this))
        this._ueberlappungLaengsSlider.addEventListener('change', this.ueberlappungLaengsUebergeben.bind(this))
        this._ueberlappungQuerSlider.addEventListener('change', this.ueberlappungQuerUebergeben.bind(this))
        this._aufloesungSlider.addEventListener('change', this.aufloesungUebergeben.bind(this))
        this._uavSelect.getHTMLElement().addEventListener('change', this.uavUebergeben.bind(this))
        this._hoeheBegrenzen.addEventListener('change', this.hoehenBegrenzungUebergeben.bind(this))
    }

    private zeichnen_fertig(event: DrawEvent) {
        this.zeichnen_beenden();
        this._gebiet = <Feature<Polygon>>event.feature;
        this.calcTrajectory();
    }

    public setFlightParameter(hoehe: number, laenge: number, dauer: number, anzahl: number) {
        this._flugHoeheInput.value = hoehe.toFixed(1);
        this._flugLaengeInput.value = laenge.toFixed(3);
        this._flugDauerInput.value = dauer.toFixed(1);
        this._bildAnzahlInput.value = anzahl.toFixed(0);

    }

    private calcTrajectory() {
        if (!this.gebietUebergeben()) return;
        this.ausrichtungUebergeben();
        this.ueberlappungQuerUebergeben();
        this.ueberlappungLaengsUebergeben();
        this.aufloesungUebergeben();
        this.uavUebergeben();
        this.hoehenBegrenzungUebergeben();
    }

    private gebietUebergeben(): boolean {
        if (!this._gebiet) return false;
        this._tc.gebiet = this._gebiet;
        return true
    }

    private hoehenBegrenzungUebergeben() {
        this._tc.hoeheBegrenzen = this._hoeheBegrenzen.checked;
    }

    private uavUebergeben() {
        this._tc.uav = this._uavSelect.getSelectedEntry();
    }

    private ueberlappungLaengsUebergeben() {
        this._tc.ueberlappungLaengs = parseInt(this._ueberlappungLaengsSlider.value) / 100;
    }

    private ueberlappungQuerUebergeben() {
        this._tc.ueberlappungQuer = parseInt(this._ueberlappungQuerSlider.value) / 100;
    }

    private ausrichtungUebergeben() {
        this._tc.ausrichtung = parseInt(this._ausrichtungSlider.value);
    }

    private aufloesungUebergeben() {
        this._tc.aufloesung = parseInt(this._aufloesungSlider.value) / 100;
    }

    private zeichnen_beenden() {
        this._button.value = "Gebiet zeichnen";
        this.setActive(false);
        this._map.setDoubleClickZoom(true);
    }

    private zeichnen_starten() {
        this._button.value = "Zeichnen abbrechen";
        this.setActive(true);
        this._map.getZeichenSource().clear();
        this._map.setDoubleClickZoom(false);
    }

    button_click() {
        if (this.getActive()) {
            this.zeichnen_beenden();
        } else {
            this.zeichnen_starten();
        }
    }
}