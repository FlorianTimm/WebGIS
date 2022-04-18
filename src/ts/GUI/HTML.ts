export class HTML {
    static createButton (parent:HTMLElement):HTMLInputElement {
        let button = document.createElement("input");
        button.setAttribute("type", "button");
        parent.appendChild(button);
        return button;
    }
}