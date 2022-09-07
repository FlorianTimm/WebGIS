import { Color } from "ol/color";
import UAV from "../UAV";
import HTML from "./HTML";
import Menu from "./Menu";

export default class KameraMenu extends Menu {
    private uavSelect: import("/mnt/ssd/Studium/MScGeodaesieGeoinformatik/2. Semester/WebGIS/UAVplaning/src/ts/GUI/HTML").HTMLSelectElementArray<UAV>;
    private name: HTMLInputElement;
    private focusLength: HTMLInputElement;
    private sensorwidth: HTMLInputElement;
    private sensorheight: HTMLInputElement;
    private sensorpixelwidth: HTMLInputElement;
    private sensorpixelheight: HTMLInputElement;

    constructor(div?: HTMLElement) {
        super(div);
        div = this.getDiv();

        this.uavSelect = HTML.createSelect(this.getDiv(), "UAV", UAV.getUAVs());
        UAV.onChange((liste) => {
            this.uavSelect.updateListe(liste);
        })

        this.name = HTML.createInput(this.getDiv(), "Name")
        this.focusLength = HTML.createNumberInput(this.getDiv(), "Brennweite")
        this.sensorwidth = HTML.createNumberInput(this.getDiv(), "Sensor-Breite")
        this.sensorheight = HTML.createNumberInput(this.getDiv(), "Sensor-Höhe")
        this.sensorpixelwidth = HTML.createNumberInput(this.getDiv(), "Pixel-Breite")
        this.sensorpixelheight = HTML.createNumberInput(this.getDiv(), "Pixel-Höhe")

        const buttonNeu = HTML.createButton(this.getDiv(), "Neu")
        buttonNeu.addEventListener('click', () => this.neuesUAV());
        const buttonAndern = HTML.createButton(this.getDiv(), "Ändern")
        buttonAndern.addEventListener('click', () => this.uavAendern());

        this.uavSelect.getHTMLElement().addEventListener('change', () => this.uavChange())
    }

    public getName(): string {
        return "UAV";
    }

    public getColor(): Color {
        return [200, 0, 200]
    }

    private async uavChange() {
        const entry = await this.uavSelect.getSelectedEntry()
        this.name.value = entry.name;
        this.focusLength.value = entry.focusLength.toString()
        this.sensorheight.value = entry.sensorSize[1].toString();
        this.sensorwidth.value = entry.sensorSize[0].toString();
        this.sensorpixelheight.value = entry.sensorPixel[1].toString();
        this.sensorpixelwidth.value = entry.sensorPixel[0].toString();
    }

    private async uavAendern() {
        const entry = await this.uavSelect.getSelectedEntry()
        entry.update({
            name: this.name.value,
            focuslength: parseFloat(this.focusLength.value),
            sensorheight: parseFloat(this.sensorheight.value),
            sensorwidth: parseFloat(this.sensorwidth.value),
            sensorpixelheight: parseInt(this.sensorpixelheight.value),
            sensorpixelwidth: parseInt(this.sensorpixelwidth.value)
        })
    }

    private neuesUAV() {
        UAV.createUAV({
            name: this.name.value,
            focuslength: parseFloat(this.focusLength.value),
            sensorheight: parseFloat(this.sensorheight.value),
            sensorwidth: parseFloat(this.sensorwidth.value),
            sensorpixelheight: parseInt(this.sensorpixelheight.value),
            sensorpixelwidth: parseInt(this.sensorpixelwidth.value)
        })
    }

}