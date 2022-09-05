import { Control } from "ol/control";
import { transformExtent } from "ol/proj";

interface Option {
    top?: string;
    left?: string;
    bottom?: string;
    right?: string;
}

interface NominatimResponse {
    "address": {},
    "boundingbox": [string, string, string, string],
    "class": string,
    "display_name": string,
    "icon": string,
    "importance": number,
    "lat": string,
    "licence": string,
    "lon": string,
    "osm_id": number,
    "osm_type": string,
    "place_id": number,
    "type": string
}
export default class LocationSearch extends Control {
    textbox: HTMLInputElement;
    constructor(opt: Option) {
        let div = document.createElement('form');
        super({ element: div });

        this.textbox = document.createElement('input');
        div.addEventListener("submit", e => this.handleInput(e))
        div.appendChild(this.textbox);

        div.style.position = 'inherit';
        if (opt.top) div.style.top = opt.top;
        if (opt.left) div.style.left = opt.left;
        if (opt.bottom) div.style.bottom = opt.bottom;
        if (opt.right) div.style.right = opt.right;
    }

    /**
     * Reaktion auf Abschluss der Eingabe
     */
    private handleInput(e: Event) {
        //https://nominatim.openstreetmap.org/?addressdetails=1&q=bakery+in+berlin+wedding&format=json&limit=1

        e.preventDefault();

        let txt = this.textbox.value;
        if (txt.length < 3) return;

        let view = this.getMap()?.getView();
        let extent = view?.calculateExtent()
        if (!extent) return;

        let bbox4326 = transformExtent(extent, 'EPSG:3857', 'EPSG:4326')

        let params = {
            "addressdetails": "1",
            "q": txt,
            "format": 'json',
            "limit": "1",
            "viewbox": bbox4326[1] + ',' + bbox4326[3] + ',' + bbox4326[0] + ',' + bbox4326[2]
        }

        fetch("https://nominatim.openstreetmap.org/?" + new URLSearchParams(params).toString(), {
            method: 'GET',
            //mode: 'no-cors'
        })
            .then((response) => response.json())
            .then((json: NominatimResponse[]) => {
                if (json.length == 0) return;
                console.log(json);

                let bbox: number[] = [];
                json[0].boundingbox.forEach(entry => bbox.push(parseFloat(entry)));
                view?.fit(transformExtent([bbox[2], bbox[0], bbox[3], bbox[1]], 'EPSG:4326', 'EPSG:3857'));
            })
    }
}