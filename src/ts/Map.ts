import { Map as OpenLayersMap, View } from "ol";
import { LineString, Point, Polygon } from "ol/geom";
import { DoubleClickZoom } from "ol/interaction";
import VectorLayer from "ol/layer/Vector";
import { fromLonLat } from "ol/proj";
import { ImageWMS } from "ol/source";
import OSM from "ol/source/OSM";
import TileWMS from 'ol/source/TileWMS';
import VectorSource from "ol/source/Vector";
import VectorTileSource from "ol/source/VectorTile";
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { ImageLayer, TileLayer, VectorTileLayer } from "./openLayers/Layer";
import { defaults as controlDefaults, ScaleLine } from "ol/control";
import TopoJSON from 'ol/format/TopoJSON';
import { FeatureLike } from "ol/Feature";
import BuilderGroup from "ol/render/canvas/BuilderGroup";
import { includes } from "ol/array";


const roadStyleCache = {};
const roadColor = {
    'major_road': '#776',
    'minor_road': '#ccb',
    'highway': '#f39',
};

export default class Map extends OpenLayersMap {

    private zeichenSource: VectorSource<Polygon>;
    private trajectorySource: VectorSource<LineString | Point>;

    constructor() {

        var fhh = '&copy; Freie und Hansestadt Hamburg, Behörde für Verkehr und Mobilitätswende';
        var lgv = '&copy; Freie und Hansestadt Hamburg, Landesbetrieb Geoinformation und Vermessung';
        var bkg = '&copy; GeoBasis-DE / BKG 2022';

        super({
            target: 'map',
            layers: [
                new TileLayer({
                    name: 'LGV schwarz-grau',
                    backgroundLayer: true,
                    switchable: true,
                    visible: true,
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
                    visible: false,
                    source: new TileWMS({
                        url: 'https://sgx.geodatenzentrum.de/wms_basemapde?',
                        params: {
                            'LAYERS': 'de_basemapde_web_raster_grau'
                        }
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
                new VectorTileLayer({
                    name: "Flugbeschränkungen (VectorTiles)",
                    switchable: true,
                    backgroundLayer: false,
                    source: new VectorTileSource({
                        attributions:
                            '&copy; OpenStreetMap contributors, Who’s On First, ' +
                            'Natural Earth, and osmdata.openstreetmap.de',
                        format: new TopoJSON({
                            layerName: 'layer',
                            layers: ['roads', 'landuse'],
                        }),
                        maxZoom: 19,
                        url:
                            'https://tile.nextzen.org/tilezen/vector/v1/all/{z}/{x}/{y}.topojson?api_key=' +
                            'peb4RRGQRSy8NfrsVb7hMg',
                    }),
                    style: function (feature: FeatureLike, nr: number) {

                        if (feature.get('layer') != 'roads') {
                            if (feature.get('kind') == 'industrial')
                                return new Style({
                                    stroke: new Stroke({
                                        color: '#f00',
                                        width: 3
                                    })
                                })
                            return null;
                        } else if (feature.get('kind') == 'construction') {
                            return null;
                        } else if ((<string>feature.get('ref') ?? '').startsWith('B')) {
                            console.log(feature.getProperties())
                            return [new Style({
                                stroke: new Stroke({
                                    color: 'rgba(0,0,255,0.5)',
                                    width: 215 / nr,
                                })
                            }),
                            new Style({
                                stroke: new Stroke({
                                    color: 'blue',
                                    width: 15 / nr,
                                })
                            })]
                        } else if ((<string>feature.get('ref') ?? '').startsWith('A')) {
                            return [new Style({
                                stroke: new Stroke({
                                    color: 'rgba(0,0,255,0.5)',
                                    width: 235 / nr,
                                })
                            }),
                            new Style({
                                stroke: new Stroke({
                                    color: 'blue',
                                    width: 35 / nr,
                                })
                            })]
                        } else {
                            return null;
                        }

                    },
                }),
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
                new ScaleLine()
            ]),
        });

        this.zeichenSource = new VectorSource({});
        let zeichenLayer = new VectorLayer({ source: this.zeichenSource });
        this.addLayer(zeichenLayer)

        this.trajectorySource = new VectorSource<LineString | Point>({});
        let trajectoryLayer = new VectorLayer({
            source: this.trajectorySource, style: new Style({
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
                interaction.setActive(b);
            }
        });
    }
}