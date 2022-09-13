import { Color } from "ol/color";

export default abstract class Menu {
    private _div: HTMLElement;

    constructor(div?: HTMLElement) {
        this._div = div ?? document.createElement('div');
    }

    public abstract get name(): string;
    public abstract get color(): Color

    public get div(): HTMLElement {
        return this._div;
    }
}