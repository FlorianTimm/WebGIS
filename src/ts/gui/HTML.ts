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
        const div = document.createElement('div');
        const input = document.createElement("input");

        input.setAttribute("type", "range");
        input.value = (voreingestellt ?? 0).toString();
        input.min = (von ?? 0).toString();
        input.max = (bis ?? 100).toString();
        input.step = (takt ?? 5).toString();

        const wert = document.createElement("output")
        wert.innerHTML = input.value
        input.onchange = () => {
            wert.innerHTML = input.value
        }

        HTML.createLabel(beschriftung, input, div);

        div.appendChild(wert);
        div.appendChild(input);
        parent.appendChild(div)
        return input;
    }

    protected static createLabel(beschriftung: string, input: HTMLElement, parent: HTMLElement): HTMLLabelElement {
        let label: HTMLLabelElement = document.createElement("label");
        label.innerHTML = beschriftung;
        if (!input.id) {
            input.id = "input" + beschriftung.replace("\\W", "");
        }
        label.htmlFor = input.id;
        parent.appendChild(label);
        return label;
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

        let select: HTMLSelectElementArray<T> = new HTMLSelectElementArray<T>(liste);
        HTML.createLabel(beschriftung, select.htmlElement, parent);
        parent.appendChild(select.htmlElement)
        return select;
    }
    static createCheckbox(parent: HTMLElement, beschriftung: string, checked = false) {
        let input = document.createElement("input");

        input.setAttribute("type", "checkbox");
        input.checked = checked;
        input.style.width = 'inherit'

        const label = HTML.createLabel(beschriftung, input, parent);
        label.insertBefore(input, label.firstChild);
        label.classList.add('checkbox')

        return input;
    }
}

export class HTMLSelectElementArray<T extends object> {
    private _htmlElement: HTMLSelectElement;
    private array: Promise<T[]>;

    constructor(listePromise: Promise<T[]>, parent?: HTMLElement) {
        this._htmlElement = document.createElement("select");

        this.array = listePromise;
        this.array.then((liste) => {
            this.updateListe(liste)
        })

        if (parent) {
            parent.appendChild(this._htmlElement);
        }
    }

    get htmlElement() {
        return this._htmlElement;
    }

    async getSelectedEntry(): Promise<T> {
        let array = await this.array;
        return array[this._htmlElement.selectedIndex]
    }

    async setSelection(vergleich: (element: T) => boolean) {
        let array = await this.array;
        array.forEach((element, index) => {
            if (vergleich(element)) {
                this.htmlElement.selectedIndex = index;
                return;
            }
        });
    }

    async updateListe(liste: T[], preselect?: T) {
        let selected = preselect ?? await this.getSelectedEntry();
        this._htmlElement.innerHTML = "";
        liste.forEach((eintrag) => {
            let option = document.createElement('option');
            option.innerHTML = eintrag.toString();
            this._htmlElement.appendChild(option);
            if (eintrag == selected) {
                option.selected = true;
            }
        });
        this.htmlElement.dispatchEvent(new Event('change'));
    }
}