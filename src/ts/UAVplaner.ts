//import "../js/import_jquery.js";
import '../../node_modules/ol/ol.css'
import '../style/index.css';
import Map from "./openLayers/Map";
import Hauptmenu from "./gui/Hauptmenu";
import { Navigation } from "./gui/Navigation";
import { LayerMenu } from "./gui/LayerMenu";
import KameraMenu from "./gui/KameraMenu";
import GenehmigungMenu from "./gui/GenehmigungMenu";


export default class UAVplaner {
    constructor() {
        let map: Map = new Map();

        let navigation = new Navigation(document.getElementsByTagName('nav')[0], document.getElementsByTagName('aside')[0]);

        // Hauptmenü
        let hm = new Hauptmenu(map);
        navigation.appendMenu(hm);

        // Layer
        let lm = new LayerMenu(map);
        navigation.appendMenu(lm);

        // UAV-Auswahl
        let um = new KameraMenu();
        navigation.appendMenu(um);

        // Genehmigung
        let gn = new GenehmigungMenu(map, hm.zeichnen);
        navigation.appendMenu(gn);
    }
}