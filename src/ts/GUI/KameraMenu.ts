import { Color } from "ol/color";
import UAV from "../UAV";
import HTML from "./HTML";
import Menu from "./Menu";

export default class KameraMenu extends Menu {

    constructor(div?: HTMLElement) {
        super(div);
        div = this.getDiv();

        const uavSelect = HTML.createSelect(this.getDiv(), "UAV", UAV.getUAVs());

        const name = HTML.createInput(this.getDiv(), "Name")
        const focusLength = HTML.createNumberInput(this.getDiv(), "Brennweite")
        const sensorwidth = HTML.createNumberInput(this.getDiv(), "Sensor-Breite")
        const sensorheight = HTML.createNumberInput(this.getDiv(), "Sensor-Höhe")
        const sensorpixelwidth = HTML.createNumberInput(this.getDiv(), "Pixel-Breite")
        const sensorpixelheight = HTML.createNumberInput(this.getDiv(), "Pixel-Höhe")

        const buttonNeu = HTML.createButton(this.getDiv(), "Neu")
        buttonNeu.addEventListener('click', () => this.neuesUAV());
        const buttonAndern = HTML.createButton(this.getDiv(), "Ändern")
        buttonAndern.addEventListener('click', () => this.uavAendern());

        uavSelect.getHTMLElement().addEventListener('change', async () => {
            const entry = await uavSelect.getSelectedEntry()
            name.value = entry.name;
            focusLength.value = entry.focusLength.toString()
            sensorheight.value = entry.sensorSize[0].toString();
            sensorwidth.value = entry.sensorSize[1].toString();
            sensorpixelheight.value = entry.sensorPixel[1].toString();
            sensorpixelwidth.value = entry.sensorPixel[0].toString();
        })
    }

    public getName(): string {
        return "UAV";
    }

    public getColor(): Color {
        return [200, 0, 200]
    }

    private uavAendern() {
        alert('Noch nicht implementiert');
    }

    private neuesUAV() {
        alert('Noch nicht implementiert');
    }

}