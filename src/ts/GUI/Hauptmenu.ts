import { Menu } from "./Menu";
import { HTML} from "./HTML"

export class Hauptmenu extends Menu {
    create(): void {
        this.div.innerHTML = "";

        let b = HTML.createButton(this.div)
        b.value = "Test"
    }
}