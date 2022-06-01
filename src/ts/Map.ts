import { Map as OpenLayersMap, View } from "ol";
import { fromLonLat } from "ol/proj";
import OSM from "ol/source/OSM";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { LineString, Polygon } from "ol/geom";
import { DoubleClickZoom } from "ol/interaction";
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import TileWMS from 'ol/source/TileWMS';
import { TileLayer } from "./openLayers/Layer";

export default class Map extends OpenLayersMap {

    private zeichenSource: VectorSource<Polygon>;
    private trajectorySource: VectorSource<LineString>;

    constructor() {

        var fhh = '&copy; Freie und Hansestadt Hamburg, Behörde für Verkehr und Mobilitätswende'
        var lgv = '&copy; Freie und Hansestadt Hamburg, Landesbetrieb Geoinformation und Vermessung'

        super({
            target: 'map',
            layers: [
                new TileLayer({
                    name: "OpenStreetMap",
                    switchable: true,
                    backgroundLayer: true,
                    source: new OSM()
                }),
                new TileLayer({
                    name: 'LGV schwarz-grau',
                    backgroundLayer: true,
                    switchable: true,
                    visible: false,
                    source: new TileWMS({
                        url: 'https://geodienste.hamburg.de/HH_WMS_Geobasiskarten_SG?',
                        params: {
                            'LAYERS': 'M100000_schwarzgrau,M2500_schwarzgrau,M5000_schwarzgrau,M60000_schwarzgrau,M10000_schwarzgrau,M20000_schwarzgrau,M40000_schwarzgrau,M125000_schwarzgrau',
                            'FORMAT': 'image/png',
                            'TRANSPARENT': 'false'
                        },
                        attributions: [fhh]
                    })
                }),
                new TileLayer({
                    name: "Flugverbotszonen Hamburg",
                    switchable: true,
                    source: new TileWMS({
                        url: 'https://geodienste.hamburg.de/HH_WMS_Drohnenflugverbotszonen',
                        params: { 'LAYERS': 'Krankenhaeuser,Flugplaetze,Hubschrauberlandeplaetze' },
                        attributions: [fhh]
                    }),
                }),
            ],
            view: new View({
                center: fromLonLat([10.2, 53.8]),
                zoom: 10
            })
        });

        this.zeichenSource = new VectorSource({});
        let zeichenLayer = new VectorLayer({ source: this.zeichenSource });
        this.addLayer(zeichenLayer)

        this.trajectorySource = new VectorSource<LineString>({});
        let trajectoryLayer = new VectorLayer({
            source: this.trajectorySource, style: new Style({
                stroke: new Stroke({
                    width: 3,
                    color: '#ff0000'
                }),

            })
        })
        this.addLayer(trajectoryLayer);
    }

    getZeichenSource() {
        return this.zeichenSource;
    }

    getTrajectorySource() {
        return this.trajectorySource;
    }

    setDoubleClickZoom(b: boolean) {
        this.getInteractions().forEach((interaction) => {
            if (interaction instanceof DoubleClickZoom) {
                console.log("Gefunden")
                interaction.setActive(b);
            }
        });
    }
}