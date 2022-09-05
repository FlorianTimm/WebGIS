import { VectorTileLayer } from "./Layer";
import VectorTileSource from "ol/source/VectorTile";
import { Circle, Fill, Stroke, Style } from 'ol/style';
import { FeatureLike } from "ol/Feature";
import MVT from 'ol/format/MVT';

export class FlugverbotVectorTiles extends VectorTileLayer {
    constructor() {
        let basemap = '&copy; basemap.de / BKG September 2022'

        let vectorTilesFlugverbotSource = new VectorTileSource({
            attributions: basemap,
            format: new MVT({
                layers: ['Verkehrslinie', 'Siedlungsflaeche', 'Verkehrsflaeche', 'Grenze_Flaeche', 'Versorgungslinie', 'Gewaesserflaeche', 'Bauwerkspunkt']
            }),
            url:
                'https://sgx.geodatenzentrum.de/gdz_basemapde_vektor/tiles/v1/bm_web_de_3857/{z}/{x}/{y}.pbf',
        })

        super({

            name: "Flugverbotszonen (BKG VectorTiles)",
            switchable: true,
            backgroundLayer: false,
            visible: true,
            opacity: 0.5,
            source: vectorTilesFlugverbotSource,
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

                if (feature.get('klasse') == 'Freileitung') {
                    //console.log(feature.getProperties())
                    return new Style({
                        stroke: new Stroke({
                            color: 'red',
                            width: 230 / nr,
                        }),
                        zIndex: 3
                    })
                }

                if (feature.get('klasse') == 'Windrad') {
                    //console.log(feature.getProperties())
                    return new Style({
                        image: new Circle({
                            radius: 105 / nr,
                            fill: new Fill({
                                color: 'red',
                            }),
                        }),
                        zIndex: 3
                    })
                }

                if (feature.get('kategorie') == 'Binnenwasserstraße' || feature.get('ordnung') == 'Gewässer I. Ordnung - Bundeswasserstraße' || feature.get('ordnung') == 'Gewässer I. Ordnung - nach Landesrecht') {
                    //console.log(feature.getProperties())
                    return [new Style({
                        fill: new Fill({
                            color: 'red',
                        }),
                        stroke: new Stroke({
                            color: 'red',
                            width: 20 / nr,
                        }),
                        zIndex: 3
                    }),
                    new Style({
                        stroke: new Stroke({
                            color: 'orange',
                            width: 200 / nr,
                        }),
                        zIndex: 1
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

                if (feature.get('klasse') == 'Siedlung' && (feature.get('art') == 'Geschlossen' || feature.get('art') == 'Offen')) {
                    return new Style({
                        fill: new Fill({
                            color: 'orange',
                        }),
                        zIndex: 2
                    })
                }

                if (feature.get('klasse') == 'Raffinerie') {
                    return new Style({
                        fill: new Fill({
                            color: 'red',
                        }),
                        zIndex: 3
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

                if (feature.get('klasse') == 'Kraftwerk' || feature.get('klasse') == 'Umspannstation') {

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
        });
    }
}



/*new VectorTileLayer({
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
               }),*/