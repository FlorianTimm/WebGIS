export default class HTML {

    static createButton(parent: HTMLElement, beschriftung: string): HTMLInputElement {
        let button = document.createElement("input");
        button.setAttribute("type", "button");
        button.value = beschriftung;
        parent.appendChild(button);
        return button;
    }

    static createInput(parent: HTMLElement, beschriftung: string, voreingestellt?: string, disabled = false): HTMLInputElement {
        let input = document.createElement("input");
        input.value = voreingestellt ?? '';
        input.disabled = disabled;

        HTML.createLabel(beschriftung, input, parent);

        parent.appendChild(input);
        parent.appendChild(document.createElement('br'))
        return input;
    }

    static createSlider(parent: HTMLElement, beschriftung: string, von: number, bis: number, voreingestellt?: number, takt?: number): HTMLInputElement {
        let input = document.createElement("input");

        input.setAttribute("type", "range");
        input.value = (voreingestellt ?? 0).toString();
        input.min = (von ?? 0).toString();
        input.max = (bis ?? 100).toString();
        input.step = (takt ?? 5).toString();

        let wert = document.createElement("span")
        wert.innerHTML = input.value
        input.onchange = () => {
            wert.innerHTML = input.value
        }

        HTML.createLabel(beschriftung, input, parent);

        parent.appendChild(wert);
        parent.appendChild(input);
        parent.appendChild(document.createElement('br'))
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

    static createNumberInput(parent: HTMLElement, beschriftung: string, voreingestellt?: number, disabled = false): HTMLInputElement {
        let voreingestelltString: string | undefined = undefined;
        if (voreingestellt) {
            voreingestelltString = voreingestellt.toString();
        }
        let intInput = HTML.createInput(parent, beschriftung, voreingestelltString, disabled);
        intInput.setAttribute("type", "number");
        return intInput;
    }

    static createSelect<T extends object>(parent: HTMLElement, beschriftung: string, liste: Promise<T[]>): HTMLSelectElementArray<T> {
        let select: HTMLSelectElementArray<T> = new HTMLSelectElementArray<T>(liste, parent);
        HTML.createLabel(beschriftung, select.getHTMLElement(), parent);
        return select;
    }
    static createCheckbox(parent: HTMLElement, beschriftung: string, checked = false) {
        let input = document.createElement("input");

        input.setAttribute("type", "checkbox");
        input.checked = checked;

        HTML.createLabel(beschriftung, input, parent);

        parent.appendChild(input);
        return input;
    }
}

export class HTMLSelectElementArray<T extends object> {
    private htmlElement: HTMLSelectElement;
    private array: Promise<T[]>;

    constructor(listePromise: Promise<T[]>, parent?: HTMLElement) {
        this.htmlElement = document.createElement("select");

        this.array = listePromise;
        this.array.then((liste) => {
            liste.forEach((eintrag) => {
                let option = document.createElement('option');
                option.innerHTML = eintrag.toString();
                this.htmlElement.appendChild(option);
            });
            this.getHTMLElement().dispatchEvent(new Event('change'));
        })

        if (parent) {
            parent.appendChild(this.htmlElement);
        }
    }

    getHTMLElement() {
        return this.htmlElement;
    }

    async getSelectedEntry(): Promise<T> {
        let array = await this.array;
        return array[this.htmlElement.selectedIndex]
    }

    async setSelection(vergleich: (element: T) => boolean) {
        let array = await this.array;
        array.forEach((element, index) => {
            if (vergleich(element)) {
                this.getHTMLElement().selectedIndex = index;
                return;
            }
        });
    }
}