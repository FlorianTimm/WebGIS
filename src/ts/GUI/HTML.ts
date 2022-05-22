export default class HTML {
    static createButton(parent: HTMLElement, beschriftung: string): HTMLInputElement {
        let button = document.createElement("input");
        button.setAttribute("type", "button");
        button.value = beschriftung;
        parent.appendChild(button);
        return button;
    }

    static createInput(parent: HTMLElement, beschriftung: string, voreingestellt?: string): HTMLInputElement {
        let input = document.createElement("input");

        input.setAttribute("type", "number");
        input.value = voreingestellt.toString();

        HTML.createLabel(beschriftung, input, parent);

        parent.appendChild(input);
        return input;
    }


    protected static createLabel(beschriftung: string, input: HTMLElement, parent: HTMLElement) {
        let label: HTMLLabelElement = document.createElement("label");
        label.innerHTML = beschriftung;
        if (input.id == undefined) {
            input.id = "input" + beschriftung.replace("\\W", "");
        }
        label.htmlFor = input.id;
        parent.appendChild(label);
    }

    static createIntInput(parent: HTMLElement, beschriftung: string, voreingestellt?: number): HTMLInputElement {
        let voreingestelltString: string;
        if (voreingestellt) {
            voreingestelltString = voreingestellt.toString();
        }
        let intInput = HTML.createInput(parent, beschriftung, voreingestelltString);
        intInput.setAttribute("type", "number");
        return intInput;
    }

    static createSelect<T>(parent: HTMLElement, beschriftung: string, liste: T[]): HTMLSelectElementArray<T> {
        let select: HTMLSelectElementArray<T> = new HTMLSelectElementArray<T>(liste, parent);
        HTML.createLabel(beschriftung, select.getHTMLElement(), parent);
        return select;
    }
}

export class HTMLSelectElementArray<T> {
    private htmlElement: HTMLSelectElement;
    private array: T[];
    constructor(liste?: T[], parent?: HTMLElement) {
        this.htmlElement = document.createElement("select");
        if (liste) {
            liste.forEach((eintrag) => {
                let option = document.createElement('option');
                option.innerHTML = eintrag.toString();
                this.htmlElement.appendChild(option);
            });
        }

        if (parent) {
            parent.appendChild(this.htmlElement);
        }
    }

    getHTMLElement() {
        return this.htmlElement;
    }
}