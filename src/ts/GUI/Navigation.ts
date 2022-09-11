import Menu from "./Menu";

export class Navigation {
    private navDiv: HTMLElement;
    private menuDiv: HTMLElement;
    private menus: Menu[];

    constructor(nav: HTMLElement, sidebar: HTMLElement, menus?: Menu[]) {
        this.navDiv = nav
        this.menuDiv = sidebar

        this.menus = menus ?? [];
        this.menus.forEach((_, index) => this.createSubMenu(index))
    }

    appendMenu(menu: Menu) {
        let index = this.menus.push(menu) - 1;
        this.createSubMenu(index);
    }

    private createSubMenu(index: number) {
        let menu = this.menus[index]
        let name = document.createElement('span');
        name.innerHTML = menu.name;


        let subMenuDiv = menu.div;
        this.navDiv.appendChild(name)
        this.menuDiv.appendChild(subMenuDiv);
        name.style.backgroundColor = 'rgb(' + menu.color.toString() + ')';
        subMenuDiv.style.backgroundColor = 'rgb(' + menu.color.toString() + ')';
        console.log(menu.color.toString());

        name.addEventListener("click", () => this.displayMenu(index))

    }

    private displayMenu(index: number) {
        this.menus.forEach((menu) => {
            menu.div.style.display = 'none';
        });
        this.menus[index].div.style.display = 'block';
    }
}