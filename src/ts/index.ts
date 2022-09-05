import "../js/import_jquery.js";
import '../../node_modules/ol/ol.css'
import '../style/index.css';
import Map from "./Map";
import Hauptmenu from "./GUI/Hauptmenu";
import { Navigation } from "./GUI/Navigation";
import { LayerMenu } from "./GUI/LayerMenu";
import KameraMenu from "./GUI/KameraMenu";
import GenehmigungMenu from "./GUI/GenehmigungMenu";

let map = new Map();

createMenu();

function createMenu() {
    let navigation = new Navigation($('nav')[0], $('sidebar')[0]);

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
    let gn = new GenehmigungMenu();
    navigation.appendMenu(gn);
}
