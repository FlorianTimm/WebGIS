import "./import_jquery.js";
import '../../node_modules/ol/ol.css'
import '../style/index.css';
import Map from "./Map";
import Hauptmenu from "./GUI/Hauptmenu";

let map = new Map();

let nav = $('nav')[0];
console.log(nav);
new Hauptmenu(nav, map);
