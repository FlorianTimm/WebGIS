import { Map as OpenLayersMap, View } from "ol";
import { LineString, Point, Polygon } from "ol/geom";
import { DoubleClickZoom } from "ol/interaction";
import VectorLayer from "ol/layer/Vector";
import { fromLonLat } from "ol/proj";
import { GeoTIFF, ImageWMS } from "ol/source";
import OSM from "ol/source/OSM";
import TileWMS from 'ol/source/TileWMS';
import VectorSource from "ol/source/Vector";
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { ImageLayer, TileLayer } from "./openLayers/Layer";
import { defaults as controlDefaults, ScaleLine } from "ol/control";
import LocationSearch from "./LocationSearch";
import { FlugverbotVectorTiles } from "./openLayers/FlugverbotLayer";
import WebGLTileLayer from "ol/layer/WebGLTile";

export default class Map extends OpenLayersMap {

    private _zeichenSource: VectorSource<Polygon>;
    private _trajectorySource: VectorSource<LineString | Point>;
    private _flugverbotVectorTiles: FlugverbotVectorTiles;

    constructor() {

        let fhh = '&copy; Freie und Hansestadt Hamburg, Behörde für Verkehr und Mobilitätswende';
        let lgv = '&copy; Freie und Hansestadt Hamburg, Landesbetrieb Geoinformation und Vermessung';
        let bkg = '&copy; GeoBasis-DE / BKG 2022';

        let flugverbotVectorTiles = new FlugverbotVectorTiles();

        super({
            target: 'map',
            layers: [
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
                        attributions: [lgv]
                    })
                }),
                new TileLayer({
                    name: 'LGV DOP',
                    backgroundLayer: true,
                    switchable: true,
                    visible: false,
                    source: new TileWMS({
                        url: 'https://geodienste.hamburg.de/HH_WMS_DOP?',
                        params: {
                            'LAYERS': 'DOP',
                            'FORMAT': 'image/jpeg',
                            'TRANSPARENT': 'false'
                        },
                        attributions: [lgv]
                    })
                }),
                new TileLayer({
                    name: "OpenStreetMap",
                    switchable: true,
                    backgroundLayer: true,
                    visible: false,
                    source: new OSM()
                }),
                new TileLayer({
                    name: "BaseMapDE",
                    backgroundLayer: true,
                    switchable: true,
                    visible: true,
                    source: new TileWMS({
                        url: 'https://sgx.geodatenzentrum.de/wms_basemapde?',
                        params: {
                            'LAYERS': 'de_basemapde_web_raster_grau'
                        },
                        attributions: [bkg]
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
                flugverbotVectorTiles,

                new ImageLayer<ImageWMS>({
                    name: "Gebietsgrenzen",
                    switchable: true,
                    source: new ImageWMS({
                        url: 'https://sgx.geodatenzentrum.de/wms_vg250?',
                        params: { 'LAYERS': 'vg250_lan,vg250_rbz,vg250_krs' },
                        attributions: [bkg]
                    }),
                }),
            ],
            view: new View({
                center: fromLonLat([10.2, 53.8]),
                zoom: 10
            }),
            controls: controlDefaults().extend([
                new ScaleLine(),
                new LocationSearch({ top: '10px', right: '10px' }),
            ]),
        });

        this._zeichenSource = new VectorSource({});
        let zeichenLayer = new VectorLayer({ source: this._zeichenSource });
        this.addLayer(zeichenLayer)

        this._trajectorySource = new VectorSource<LineString | Point>({});
        let trajectoryLayer = new VectorLayer({
            source: this._trajectorySource, style: new Style({
                stroke: new Stroke({
                    width: 3,
                    color: '#ff0000'
                }),

                image: new CircleStyle({
                    radius: 7,
                    fill: new Fill({
                        color: '#ffcc33',
                    }),
                }),

            })
        })
        this.addLayer(trajectoryLayer);
        this.createDropSupport();

        this._flugverbotVectorTiles = flugverbotVectorTiles;
    }

    public get zeichenSource() {
        return this._zeichenSource;
    }

    public get trajectorySource() {
        return this._trajectorySource;
    }

    public setDoubleClickZoom(b: boolean) {
        this.getInteractions().forEach((interaction) => {
            if (interaction instanceof DoubleClickZoom) {
                interaction.setActive(b);
            }
        });
    }


    createDropSupport() {
        let dropArea = this.getTargetElement();


        (['dragenter', 'dragover', 'dragleave', 'drop']).forEach(eventName => {
            dropArea.addEventListener(eventName, preventDefaults, false)
        })

        function preventDefaults(e: Event) {
            e.preventDefault()
            e.stopPropagation()
        }

        dropArea.addEventListener('drop', (e: DragEvent) => {
            let dt = e.dataTransfer
            if (!dt) return;
            let files = dt.files
            for (let i = 0; i < files.length; i++) {

                let file = files.item(i);
                if (file === null) return;
                console.log(file);
                let dataurl = URL.createObjectURL(file);
                let geotiff = new GeoTIFF({
                    sources: [
                        {
                            url: dataurl,
                            min: 0,
                            max: 255,
                            nodata: 0,
                        }
                    ]
                })
                console.log(geotiff)
                let layer = new WebGLTileLayer({
                    source: geotiff,
                });

                this.addLayer(layer)
                console.log("hinzu")

                // }
            };
        });
    }

    public get flugverbotVectorTiles() {
        return this._flugverbotVectorTiles;
    }

}