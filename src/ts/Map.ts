import { Map as OpenLayersMap, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { fromLonLat } from "ol/proj";
import OSM from "ol/source/OSM";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import { LineString, Polygon } from "ol/geom";
import { DoubleClickZoom } from "ol/interaction";
import Style from "ol/style/Style";
import Stroke from "ol/style/Stroke";
import TileWMS from 'ol/source/TileWMS';

export default class Map extends OpenLayersMap {

    private zeichenSource: VectorSource<Polygon>;
    private trajectorySource: VectorSource<LineString>;

    constructor() {
        super({
            target: 'map',
            layers: [
                new TileLayer({
                    source: new OSM()
                }),
                new TileLayer({
                    source: new TileWMS({
                        url: 'https://geodienste.hamburg.de/HH_WMS_Drohnenflugverbotszonen',
                        params: { 'LAYERS': 'Krankenhaeuser,Flugplaetze,Hubschrauberlandeplaetze' }
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