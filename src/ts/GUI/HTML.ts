export default class HTML {
    static createButton(parent: HTMLElement, beschriftung: string): HTMLInputElement {
        let button = document.createElement("input");
        button.setAttribute("type", "button");
        button.value = beschriftung;
        parent.appendChild(button);
        return button;
    }

    static createIntInput(parent: HTMLElement, beschriftung: string): HTMLInputElement {
        let button = document.createElement("input");
        button.setAttribute("type", "number");
        button.value = beschriftung;
        parent.appendChild(button);
        return button;
    }
}