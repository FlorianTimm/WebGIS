import { Feature } from "ol";
import { Polygon } from "ol/geom";
import { Draw } from "ol/interaction";
import { DrawEvent } from "ol/interaction/Draw";
import Map from "../Map";
import TrajectoryCalc from "../TrajectoryCalc";

export default class Zeichnen extends Draw {
    private button: HTMLButtonElement;
    private map: Map;

    constructor(map: Map, button: HTMLButtonElement) {
        super({
            type: 'Polygon',
            source: map.getZeichenSource()
        });
        this.map = map;
        this.button = button;

        this.on("drawend", (event: DrawEvent) => { this.zeichnen_fertig(event) })
        this.setActive(false)
        this.map.addInteraction(this)

        $(this.button).on('click', () => { this.button_click() })
    }

    private zeichnen_fertig(event: DrawEvent) {
        let tc = new TrajectoryCalc(this.map);
        tc.recalcTrajectory(<Feature<Polygon>>event.feature);
        this.zeichnen_beenden();
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