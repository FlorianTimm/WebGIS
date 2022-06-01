import { Color } from "ol/color";

export default abstract class Menu {
    private div: HTMLElement;

    constructor(div?: HTMLElement) {
        this.div = div ?? document.createElement('div');
    }

    public abstract getName(): string;
    public abstract getColor(): Color

    public getDiv(): HTMLElement {
        return this.div;
    }
}