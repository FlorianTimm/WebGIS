import { Color } from "ol/color";
import Menu from "./Menu";

export default class KameraMenu extends Menu {

    constructor(div?: HTMLElement) {
        super(div);
        div = this.getDiv();
        div.innerHTML = "KameraMenü";
    }

    public getName(): string {
        return "UAV";
    }

    public getColor(): Color {
        return [200, 0, 200]
    }

}