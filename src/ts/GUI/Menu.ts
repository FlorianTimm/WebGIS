export abstract class Menu {
    protected div:HTMLElement;

    constructor(div: HTMLElement ) {
        this.div = div;
        this.create();
    }

    abstract create():void
}