import { Map as OpenLayersMap, View } from "ol";
import { Geometry, LineString, Point, Polygon } from "ol/geom";
import { DoubleClickZoom } from "ol/interaction";
import VectorLayer from "ol/layer/Vector";
import { fromLonLat } from "ol/proj";
import { GeoTIFF, ImageWMS } from "ol/source";
import OSM from "ol/source/OSM";
import TileWMS from 'ol/source/TileWMS';
import VectorSource from "ol/source/Vector";
import VectorTileSource from "ol/source/VectorTile";
import { Circle as CircleStyle, Fill, Stroke, Style } from 'ol/style';
import { ImageLayer, TileLayer, VectorTileLayer } from "./openLayers/Layer";
import { defaults as controlDefaults, ScaleLine } from "ol/control";
import TopoJSON from 'ol/format/TopoJSON';
import { FeatureLike } from "ol/Feature";
import MVT from 'ol/format/MVT';
import LocationSearch from "./LocationSearch";

export default class Map extends OpenLayersMap {

    private zeichenSource: VectorSource<Polygon>;
    private trajectorySource: VectorSource<LineString | Point>;

    constructor() {

        let fhh = '&copy; Freie und Hansestadt Hamburg, Behörde für Verkehr und Mobilitätswende';
        let lgv = '&copy; Freie und Hansestadt Hamburg, Landesbetrieb Geoinformation und Vermessung';
        let bkg = '&copy; GeoBasis-DE / BKG 2022';
        let basemap = '&copy; basemap.de / BKG September 2022'

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
                new VectorTileLayer({

                    name: "BKG VectorTiles",
                    switchable: true,
                    backgroundLayer: false,
                    visible: false,
                    opacity: 0.5,
                    source: new VectorTileSource({
                        attributions: basemap,
                        format: new MVT({
                            layers: ['Verkehrslinie', 'Siedlungsflaeche', 'Verkehrsflaeche', 'Grenze_Flaeche']
                        }),
                        url:
                            'https://sgx.geodatenzentrum.de/gdz_basemapde_vektor/tiles/v1/bm_web_de_3857/{z}/{x}/{y}.pbf',
                    }),
                    style: (feature: FeatureLike, nr: number) => {

                        if (feature.get('klasse') == 'Bundesstraße') {
                            //console.log(feature.getProperties())
                            return [new Style({
                                stroke: new Stroke({
                                    color: 'yellow',
                                    width: (200 + (feature.get('breite') ?? 10)) / nr,
                                }),
                                zIndex: 1
                            }),
                            new Style({
                                stroke: new Stroke({
                                    color: 'red',
                                    width: (20 + (feature.get('breite') ?? 10)) / nr,
                                }),
                                zIndex: 3
                            })]
                        }

                        if (feature.get('klasse') == 'Bundesautobahn') {
                            //console.log(feature.getProperties())
                            return [new Style({
                                stroke: new Stroke({
                                    color: 'yellow',
                                    width: (200 + (feature.get('breite') ?? 30)) / nr,
                                }),
                                zIndex: 1
                            }),
                            new Style({
                                stroke: new Stroke({
                                    color: 'red',
                                    width: (20 + (feature.get('breite') ?? 30)) / nr,
                                }),
                                zIndex: 3
                            })]
                        }

                        if (feature.get('klasse') == 'Bahnverkehr') {

                            return [new Style({
                                stroke: new Stroke({
                                    color: 'yellow',
                                    width: 200 / nr,
                                }),

                                zIndex: 1
                            }), new Style({
                                fill: new Fill({
                                    color: 'red',
                                }),

                                stroke: new Stroke({
                                    color: 'red',
                                    width: 20 / nr,
                                }),

                                zIndex: 3
                            }),]
                        }

                        if (feature.get('klasse') == 'Eisenbahn') {
                            //console.log(feature.getProperties())
                            return [new Style({
                                stroke: new Stroke({
                                    color: 'yellow',
                                    width: (200 + (feature.get('anzahl') ?? 2000) / 200) / nr,
                                }),
                                zIndex: 1
                            }),
                            new Style({
                                stroke: new Stroke({
                                    color: 'red',
                                    width: (20 + (feature.get('anzahl') ?? 2000) / 200) / nr,
                                }),
                                zIndex: 3
                            })]
                        }

                        if (feature.get('klasse') == 'Industrie- und Gewerbefläche') {
                            return new Style({
                                fill: new Fill({
                                    color: 'orange',
                                }),
                                zIndex: 2
                            })
                        }

                        if (feature.get('funktion') == 'Sicherheit und Ordnung' || feature.get('funktion') == 'Verwaltung') {

                            return new Style({
                                fill: new Fill({
                                    color: 'red',
                                }),

                                stroke: new Stroke({
                                    color: 'red',
                                    width: 200 / nr,
                                }),

                                zIndex: 3
                            })
                        }

                        if (feature.get('klasse') == 'Naturschutzgebiet') {
                            return new Style({
                                fill: new Fill({
                                    color: 'red',
                                }),
                                zIndex: 3
                            })
                        }


                        return [];
                    },
                }),
                new VectorTileLayer({
                    name: "Flugbeschränkungen (VectorTiles)",
                    switchable: true,
                    backgroundLayer: false,
                    visible: false,
                    opacity: 0.5,
                    source: new VectorTileSource({
                        attributions:
                            '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
                        format: new MVT({
                            layers: ['landuse', 'transportation', 'transportation_name']
                        }),
                        maxZoom: 14,
                        url:
                            'https://api.maptiler.com/tiles/v3-openmaptiles/{z}/{x}/{y}.pbf?key=hcVtfWQB7sUmTPO7pbWz',
                    }),
                    style: (feature: FeatureLike, nr: number) => {
                        console.log(feature)
                        if (feature.get('kind') == 'construction') {
                            return [];
                        } else if (feature.get('layer') == 'landuse') {
                            if (feature.get('class') == 'industrial')
                                return new Style({
                                    fill: new Fill({
                                        color: '#00f',
                                    }),
                                    zIndex: 2
                                })
                        } else if (feature.get('layer') == 'transportation_name') {
                            if ((<string>feature.get('ref') ?? '').startsWith('B')) {
                                //console.log(feature.getProperties())
                                return [new Style({
                                    stroke: new Stroke({
                                        color: 'yellow',
                                        width: 215 / nr,
                                    }),
                                    zIndex: 1
                                }),
                                new Style({
                                    stroke: new Stroke({
                                        color: 'red',
                                        width: 35 / nr,
                                    }),
                                    zIndex: 3
                                })]
                            } else if ((<string>feature.get('ref') ?? '').startsWith('A')) {
                                return [new Style({
                                    stroke: new Stroke({
                                        color: 'yellow',
                                        width: 235 / nr,

                                    }),
                                    zIndex: 1
                                }),
                                new Style({
                                    stroke: new Stroke({
                                        color: 'red',
                                        width: 55 / nr,
                                    }),
                                    zIndex: 3
                                })]
                            }

                        } else if (feature.get('layer') == 'transportation' && feature.get('class') == 'rail') {
                            return [new Style({
                                stroke: new Stroke({
                                    color: 'yellow',
                                    width: 205 / nr,
                                }),
                                zIndex: 1
                            }),
                            new Style({
                                stroke: new Stroke({
                                    color: 'red',
                                    width: 25 / nr,
                                }),
                                zIndex: 3
                            })]
                        }
                        return [];
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
                new ScaleLine(),
                new LocationSearch({ top: '10px', right: '10px' }),
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
        this.createDropSupport();
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
            let files = <any>dt.files;

            ([...files]).forEach((file) => {
                console.log(file);
                let reader = new FileReader()
                reader.readAsDataURL(file)
                reader.onloadend = () => {
                    //let img = document.createElement('img')
                    if (!reader.result) return;
                    var blob = new Blob([reader.result]);
                    let dataurl = URL.createObjectURL(blob);
                    console.log(blob.arrayBuffer())
                    let geotiff = new GeoTIFF({
                        sources: [{
                            blob: blob
                        }],
                    })
                    let layer = new TileLayer({
                        source: geotiff,
                    });
                    this.addLayer(layer)

                }
            });
        });
    }
}