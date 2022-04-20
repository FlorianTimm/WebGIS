import Menu from "./Menu";
import HTML from "./HTML"
import { Map } from "ol";
import Draw from 'ol/interaction/Draw';
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";

export default class Hauptmenu extends Menu {
    private map: Map;
    private interactionDraw: Draw;
    private buttonZeichnen: HTMLButtonElement;
    private source: VectorSource

    constructor(div: HTMLElement, map: Map) {
        super(div);
        this.map = map;

        this.source = new VectorSource({})
        let layer = new VectorLayer({ source: this.source })
        this.map.addLayer(layer)

        this.interactionDraw = new Draw({
            type: 'Polygon',
            source: this.source
        });
        this.interactionDraw.on("drawend", () => { this.zeichnen_beenden() })
        this.interactionDraw.setActive(false)
        this.map.addInteraction(this.interactionDraw)
    }

    create(): void {
        this.div.innerHTML = "";
        this.buttonZeichnen = HTML.createButton(this.div, "Gebiet zeichnen")
        $(this.buttonZeichnen).on('click', () => { this.button_click() })
    }

    button_click() {
        if (this.interactionDraw.getActive()) {
            this.zeichnen_beenden();
        } else {
            this.zeichnen_starten();
        }
    }

    private zeichnen_beenden() {
        this.buttonZeichnen.value = "Gebiet zeichnen";
        this.interactionDraw.setActive(false);
    }

    private zeichnen_starten() {
        this.buttonZeichnen.value = "Zeichnen abbrechen";
        this.interactionDraw.setActive(true);
        this.source.clear();
    }
}