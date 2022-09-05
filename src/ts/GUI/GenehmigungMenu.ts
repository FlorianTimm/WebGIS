import { Color } from "ol/color";
import Menu from "./Menu";

export default class GenehmigungMenu extends Menu {
    constructor() {
        super();
    }

    public getName(): string {
        return "Genehmigung"
    }
    public getColor(): Color {
        return [250, 100, 100]
    }

}