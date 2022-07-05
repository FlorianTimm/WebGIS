import { Feature } from "ol";
import { none } from "ol/centerconstraint";
import { Polygon } from "ol/geom";
import { Draw } from "ol/interaction";
import { DrawEvent } from "ol/interaction/Draw";
import Map from "../Map";
import TrajectoryCalc from "../TrajectoryCalc";
import UAV from "../UAV";
import { HTMLSelectElementArray } from "./HTML";

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

    constructor(map: Map, conf: {
        button: HTMLButtonElement,
        ausrichtung: HTMLInputElement,
        ueberlappungQuer: HTMLInputElement,
        ueberlappungLaengs: HTMLInputElement,
        aufloesung: HTMLInputElement,
        uav: HTMLSelectElementArray<UAV>;
    }) {
        super({
            type: 'Polygon',
            source: map.getZeichenSource()
        });
        this._map = map;
        this._button = conf.button;
        this._ausrichtungSlider = conf.ausrichtung;

        this._ueberlappungLaengsSlider = conf.ueberlappungLaengs;
        this._ueberlappungQuerSlider = conf.ueberlappungQuer;
        this._aufloesungSlider = conf.aufloesung;
        this._uavSelect = conf.uav;

        this.on("drawend", (event: DrawEvent) => { this.zeichnen_fertig(event) })
        this.setActive(false)
        this._map.addInteraction(this)

        this._tc = new TrajectoryCalc(this._map);

        this._button.addEventListener('click', () => {
            console.log("Zeichnen");
            this.button_click()
        })

        this._ausrichtungSlider.addEventListener('change', () => { this.calcTrajectory() })
        this._ueberlappungLaengsSlider.addEventListener('change', () => { this.calcTrajectory() })
        this._ueberlappungQuerSlider.addEventListener('change', () => { this.calcTrajectory() })
        this._aufloesungSlider.addEventListener('change', () => { this.calcTrajectory() })
        this._uavSelect.getHTMLElement().addEventListener('change', () => { this.calcTrajectory() })
    }

    private zeichnen_fertig(event: DrawEvent) {
        this.zeichnen_beenden();
        this._gebiet = <Feature<Polygon>>event.feature;
        this.calcTrajectory();
    }

    private calcTrajectory() {
        if (!this._gebiet) return;
        this._tc.gebiet = this._gebiet;
        this._tc.ausrichtung = parseInt(this._ausrichtungSlider.value);
        this._tc.ueberlappungQuer = parseInt(this._ueberlappungQuerSlider.value);
        this._tc.ueberlappungLaengs = parseInt(this._ueberlappungLaengsSlider.value);
        this._tc.aufloesung = parseInt(this._aufloesungSlider.value);
        //this.tc.setUAV()
        this._tc.recalcTrajectory()
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