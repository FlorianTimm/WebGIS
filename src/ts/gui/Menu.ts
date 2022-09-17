import { Color } from "ol/color";

export default abstract class Menu {
    private _div: HTMLElement;
    public abstract get color(): Color;

    public get div(): HTMLElement {
        return this._div;
    }

    public abstract get name(): string;

    constructor(div?: HTMLElement) {
        this._div = div ?? document.createElement('div');
    }

    public abstract activated(): void;
}