import Menu from "./Menu";

export class Navigation {
    private menuDiv: HTMLElement;
    private menus: Menu[];
    private navDiv: HTMLElement;
    constructor(nav: HTMLElement, sidebar: HTMLElement, menus?: Menu[]) {
        this.navDiv = nav
        this.menuDiv = sidebar

        this.menus = menus ?? [];
        this.menus.forEach((_, index) => this.createSubMenu(index))
    }

    private createSubMenu(index: number) {
        let menu = this.menus[index]
        let nameDiv = document.createElement('div');
        const nameSpan = document.createElement('span');
        nameSpan.innerHTML = menu.name;
        nameDiv.appendChild(nameSpan);


        let subMenuDiv = menu.div;
        this.navDiv.appendChild(nameDiv)
        this.menuDiv.appendChild(subMenuDiv);
        nameDiv.style.backgroundColor = 'rgb(' + menu.color.toString() + ')';
        subMenuDiv.style.backgroundColor = 'rgb(' + menu.color.toString() + ')';
        console.log(menu.color.toString());

        nameDiv.addEventListener("click", () => this.displayMenu(nameDiv, index))

        if (index == 0) {
            nameDiv.classList.add('selected');
            menu.activated();
        }

    }

    private displayMenu(nameDiv: HTMLDivElement, index: number) {
        if (this.menus[index].div.style.display == 'block' && document.body.classList.contains('sidebarVisible')) {
            document.body.classList.remove('sidebarVisible');
        } else {
            document.body.classList.add('sidebarVisible');
        }
        this.menus.forEach((menu) => {
            menu.div.style.display = 'none';
        });

        [...this.navDiv.children].forEach((e) => {
            e.classList.remove('selected');
        });
        this.menus[index].div.style.display = 'block';
        this.menus[index].activated();
        nameDiv.classList.add('selected');
    }

    appendMenu(menu: Menu) {
        let index = this.menus.push(menu) - 1;
        this.createSubMenu(index);
    }
}