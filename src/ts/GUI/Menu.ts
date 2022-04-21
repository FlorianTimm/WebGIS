export default abstract class Menu {
    protected div: HTMLElement;

    constructor(div: HTMLElement) {
        this.div = div;
        this.create();
    }

    protected abstract create(): void
}