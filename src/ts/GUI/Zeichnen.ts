import { Feature } from "ol";
import { none } from "ol/centerconstraint";
import { Polygon } from "ol/geom";
import { Draw } from "ol/interaction";
import { DrawEvent } from "ol/interaction/Draw";
import Map from "../Map";
import TrajectoryCalc from "../TrajectoryCalc";

export default class Zeichnen extends Draw {
    private button: HTMLButtonElement;
    private ausrichtungSlider: HTMLInputElement;
    private map: Map;
    private tc: TrajectoryCalc;
    private gebiet: Feature<Polygon>;

    constructor(map: Map, button: HTMLButtonElement, ausrichtung: HTMLInputElement) {
        super({
            type: 'Polygon',
            source: map.getZeichenSource()
        });
        this.map = map;
        this.button = button;
        this.ausrichtungSlider = ausrichtung;

        this.on("drawend", (event: DrawEvent) => { this.zeichnen_fertig(event) })
        this.setActive(false)
        this.map.addInteraction(this)

        this.tc = new TrajectoryCalc(this.map);

        this.button.addEventListener('click', () => {
            console.log("Zeichnen");
            this.button_click()
        })

        this.ausrichtungSlider.addEventListener('change', () => { this.calcTrajectory() })
    }

    private zeichnen_fertig(event: DrawEvent) {
        this.zeichnen_beenden();
        this.gebiet = <Feature<Polygon>>event.feature;
        this.calcTrajectory();
    }

    private calcTrajectory() {
        if (!this.gebiet) return;
        this.tc.recalcTrajectory(this.gebiet, parseInt(this.ausrichtungSlider.value));
    }

    private zeichnen_beenden() {
        this.button.value = "Gebiet zeichnen";
        this.setActive(false);
        this.map.setDoubleClickZoom(true);
    }

    private zeichnen_starten() {
        this.button.value = "Zeichnen abbrechen";
        this.setActive(true);
        this.map.getZeichenSource().clear();
        this.map.setDoubleClickZoom(false);
    }

    button_click() {
        if (this.getActive()) {
            this.zeichnen_beenden();
        } else {
            this.zeichnen_starten();
        }
    }
}