import { Color } from "ol/color";
import UAV from "../entities/UAV";
import HTML, { HTMLSelectElementArray } from "./HTML";
import Menu from "./Menu";

export default class KameraMenu extends Menu {
    private uavSelect: HTMLSelectElementArray<UAV>;
    private uavName: HTMLInputElement;
    private focusLength: HTMLInputElement;
    private sensorwidth: HTMLInputElement;
    private sensorheight: HTMLInputElement;
    private sensorpixelwidth: HTMLInputElement;
    private sensorpixelheight: HTMLInputElement;

    constructor(div?: HTMLElement) {
        super(div);
        div = this.div;

        this.uavSelect = HTML.createSelect(this.div, "UAV", UAV.getUAVs());
        UAV.onChange((liste) => {
            this.uavSelect.updateListe(liste);
        })

        this.uavName = HTML.createInput(this.div, "Name")
        this.focusLength = HTML.createNumberInput(this.div, "Brennweite")
        this.sensorwidth = HTML.createNumberInput(this.div, "Sensor-Breite")
        this.sensorheight = HTML.createNumberInput(this.div, "Sensor-Höhe")
        this.sensorpixelwidth = HTML.createNumberInput(this.div, "Pixel-Breite")
        this.sensorpixelheight = HTML.createNumberInput(this.div, "Pixel-Höhe")

        const buttonNeu = HTML.createButton(this.div, "Neu")
        buttonNeu.addEventListener('click', () => this.neuesUAV());
        const buttonAndern = HTML.createButton(this.div, "Ändern")
        buttonAndern.addEventListener('click', () => this.uavAendern());

        this.uavSelect.htmlElement.addEventListener('change', () => this.uavChange())
    }

    public get name(): string {
        return "UAV";
    }

    public get color(): Color {
        return [200, 0, 200]
    }

    private async uavChange() {
        const entry = await this.uavSelect.getSelectedEntry()
        this.uavName.value = entry.name;
        this.focusLength.value = entry.focusLength.toString()
        this.sensorheight.value = entry.sensorSize[1].toString();
        this.sensorwidth.value = entry.sensorSize[0].toString();
        this.sensorpixelheight.value = entry.sensorPixel[1].toString();
        this.sensorpixelwidth.value = entry.sensorPixel[0].toString();
    }

    private async uavAendern() {
        const entry = await this.uavSelect.getSelectedEntry()
        entry.update({
            name: this.uavName.value,
            focuslength: parseFloat(this.focusLength.value),
            sensorheight: parseFloat(this.sensorheight.value),
            sensorwidth: parseFloat(this.sensorwidth.value),
            sensorpixelheight: parseInt(this.sensorpixelheight.value),
            sensorpixelwidth: parseInt(this.sensorpixelwidth.value)
        })
    }

    private neuesUAV() {
        UAV.createUAV({
            name: this.uavName.value,
            focuslength: parseFloat(this.focusLength.value),
            sensorheight: parseFloat(this.sensorheight.value),
            sensorwidth: parseFloat(this.sensorwidth.value),
            sensorpixelheight: parseInt(this.sensorpixelheight.value),
            sensorpixelwidth: parseInt(this.sensorpixelwidth.value)
        })
    }
    public activated(): void {
        console.log("Kameramenü aktiviert")
    }
}