import Menu from "./Menu";
import Map from "../openLayers/Map";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import Zeichnen from "./Zeichnen";
import { Color } from "ol/color";
import HTML from "./HTML";

export default class Hauptmenu extends Menu {
    private map: Map;
    private source: VectorSource
    private _zeichnen: Zeichnen;

    constructor(map: Map, div?: HTMLElement) {
        super(div);
        this.map = map;

        this.source = new VectorSource({})
        let layer = new VectorLayer({ source: this.source })
        this.map.addLayer(layer)

        this._zeichnen = new Zeichnen(this.map, this.div);

        let projektName = this.findGetParameter('projekt')
        let linkButtonText = "Link generieren";
        if (projektName) {
            linkButtonText = "Projekt speichern"

            fetch('/api/projekt/' + projektName).then(async (response) => {
                this._zeichnen.setConfig(await response.json());
            })
        }

        let exportDataKML = document.createElement('button');
        this.div.appendChild(exportDataKML)
        exportDataKML.addEventListener('click', () => this._zeichnen.exportTrajectory('KML'))
        exportDataKML.innerHTML = "KML"

        let exportDataGPX = document.createElement('button');
        this.div.appendChild(exportDataGPX)
        exportDataGPX.addEventListener('click', () => this._zeichnen.exportTrajectory('GPX'))
        exportDataGPX.innerHTML = "GPX"


        let linkButton = HTML.createButton(this.div, linkButtonText)
        linkButton.addEventListener("click", async () => {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(await this._zeichnen.getConfig())
            };
            let url = '/api/projekt/'
            let projektLink = '';
            if (projektName) {
                requestOptions['method'] = 'PUT';
                url += projektName;
            }
            fetch(url, requestOptions)
                .then(async (response) => {
                    let json = await response.json()
                    projektName = json.projekt;
                    projektLink = 'http://localhost:9000?projekt=' + json.projekt;

                    if (response.status == 201) {
                        return navigator.clipboard.writeText(projektLink)
                    }
                    return Promise.reject();
                }).then(() => {
                    alert("Link in Zwischenablage kopiert!")
                    window.history.pushState('Projekt', 'UAV-Projekt', projektLink);
                    linkButton.value = "Projekt speichern"
                }).catch(() => {
                    alert("Projekt konnte nicht gespeichert werden!")
                })
        })


    }

    public get name(): string {
        return "Hauptmenü";
    }

    public get color(): Color {
        return [200, 200, 0]
    }

    private findGetParameter(parameterName: string): string | null {
        // Source: https://stackoverflow.com/questions/5448545/how-to-retrieve-get-parameters-from-javascript
        let result: string | null = null,
            tmp: string[] = [];
        location.search
            .substring(1)
            .split("&")
            .forEach(function (item) {
                tmp = item.split("=");
                if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
            });
        return result;
    }

    public get zeichnen(): Zeichnen {
        return this._zeichnen;
    }

    public activated(): void {
        console.log("Hauptmenü aktiviert")
    }
}