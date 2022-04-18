import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { fromLonLat } from "ol/proj";
import OSM from "ol/source/OSM"

import "./import_jquery.js";
import '../../node_modules/ol/ol.css'
import '../style/index.css';
import { Hauptmenu } from "./GUI/Hauptmenu";

let map = new Map({
    target: 'map',
    layers: [
        new TileLayer({
            source: new OSM()
        })
    ],
    view: new View({
        center: fromLonLat([10.2,53.8]),
        zoom: 10
    })
});

let nav = $('nav')[0]
console.log(nav);
new Hauptmenu(nav)
