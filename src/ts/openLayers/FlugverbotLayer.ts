import { VectorTileLayer } from "./Layer";
import VectorTileSource from "ol/source/VectorTile";
import { Circle, Fill, Stroke, Style } from 'ol/style';
import Feature, { FeatureLike } from "ol/Feature";
import MVT from 'ol/format/MVT';

export class FlugverbotVectorTiles extends VectorTileLayer {
    private static _selection: string | undefined;

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
                return FlugverbotVectorTiles.featureFilter(feature, nr).style
            },
        });
    }

    public static get selection(): string | undefined {
        return FlugverbotVectorTiles._selection;
    }
    public static set selection(value: string | undefined) {
        FlugverbotVectorTiles._selection = value;
    }


    static featureFilter(feature: Feature | FeatureLike, nr: number = 100): { style: Style[], title: string, text?: string } {
        let r: { style: Style[], title: string, text?: string } = { style: [], title: '' };
        if (feature.get('klasse') == 'Bundesstraße') {
            //console.log(feature.getProperties())
            r = {
                style:
                    [new Style({
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
                    })],
                title: 'Bundesstraße',
                text: 'Das Fliegen über Bundesstraßen und in bis zu 10m Entfernung ist verboten. Bis 100m Entfernung gilt die 1:1-Regel.'
            }
        }

        else if (feature.get('klasse') == 'Bundesautobahn') {
            //console.log(feature.getProperties())
            r = {
                style: [new Style({
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
                })],
                title: 'Autobahn',
                text: 'Das Fliegen über Autobahnen und in bis zu 10m Entfernung ist verboten. Bis 100m Entfernung gilt die 1:1-Regel.'
            }
        }

        else if (feature.get('klasse') == 'Freileitung') {
            //console.log(feature.getProperties())
            r = {
                style:
                    [new Style({
                        stroke: new Stroke({
                            color: 'red',
                            width: 230 / nr,
                        }),
                        zIndex: 3
                    })],
                title: 'Freileitung',
                text: 'Zu Freileitungen muss ein Abstand von 100m eingehalten werden.'
            }
        }

        else if (feature.get('klasse') == 'Windrad') {
            //console.log(feature.getProperties())
            r = {
                style: [new Style({
                    image: new Circle({
                        radius: 105 / nr,
                        fill: new Fill({
                            color: 'red',
                        }),
                    }),
                    zIndex: 3
                })],
                title: 'Windrad',
                text: 'Zu Windrädern muss ein Abstand von 100m eingehalten werden.'
            }
        }

        else if (feature.get('kategorie') == 'Binnenwasserstraße' || feature.get('ordnung') == 'Gewässer I. Ordnung - Bundeswasserstraße' || feature.get('ordnung') == 'Gewässer I. Ordnung - nach Landesrecht') {
            //console.log(feature.getProperties())
            r = {
                style: [new Style({
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
                })],
                title: 'Wasserstraßen'
            }
        }

        else if (feature.get('klasse') == 'Bahnverkehr') {

            r = {
                style:
                    [new Style({
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
                    }),],
                title: 'Bahnflächen'
            }
        }

        else if (feature.get('klasse') == 'Eisenbahn') {
            //console.log(feature.getProperties())
            r = {
                style: [new Style({
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
                })],
                title: 'Eisenbahn'
            }
        }

        else if (feature.get('klasse') == 'Industrie- und Gewerbefläche') {
            r = {
                style: [new Style({
                    fill: new Fill({
                        color: 'orange',
                    }),
                    zIndex: 2
                })],
                title: 'Industrie- und Gewerbefläche',
                text: "Zu Industrieanlagen muss ein Abstand von 100m eingehalten werden."
            }
        }

        else if (feature.get('klasse') == 'Siedlung' && (feature.get('art') == 'Geschlossen' || feature.get('art') == 'Offen')) {
            r = {
                style: [new Style({
                    fill: new Fill({
                        color: 'orange',
                    }),
                    zIndex: 2
                })],
                title: 'Wohnbebauung',
                text: "Wohngrundstücke dürfen nur mit Erlaubnis des Nutzungsberechtigen oder in Ausnahmefällen über 100m Flughöhe überflogen werden."
            }
        }

        else if (feature.get('klasse') == 'Raffinerie') {
            r = {
                style: [new Style({
                    fill: new Fill({
                        color: 'red',
                    }),
                    zIndex: 3
                })],
                title: 'Raffinerie'
            }
        }


        else if (feature.get('funktion') == 'Sicherheit und Ordnung' || feature.get('funktion') == 'Verwaltung') {

            r = {
                style: [new Style({
                    fill: new Fill({
                        color: 'red',
                    }),

                    stroke: new Stroke({
                        color: 'red',
                        width: 200 / nr,
                    }),

                    zIndex: 3
                })],
                title: 'Sicherheit & Ordnung'
            }
        }

        else if (feature.get('klasse') == 'Kraftwerk' || feature.get('klasse') == 'Umspannstation') {

            r = {
                style: [new Style({
                    fill: new Fill({
                        color: 'red',
                    }),

                    stroke: new Stroke({
                        color: 'red',
                        width: 200 / nr,
                    }),

                    zIndex: 3
                })],
                title: 'Kraftwerk',
                text: 'Zentrale Energieerzeugungsanlagen dürfen nicht überflogen werden.'
            }
        }

        else if (feature.get('klasse') == 'Naturschutzgebiet') {
            r = {
                style: [new Style({
                    fill: new Fill({
                        color: 'red',
                    }),
                    zIndex: 3
                })],
                title: 'Naturschutzgebiet',
                text: 'Das Überfliegen von Naturschutzgebieten ist nur mit Genehmigung erlaubt.'
            }
        }

        if (r.title == FlugverbotVectorTiles._selection) {
            console.log('Markiert')
            r.style.push(new Style({
                fill: new Fill({
                    color: 'blue',
                }),
                stroke: new Stroke({
                    color: 'blue',
                    width: 5
                }),
                zIndex: 4
            }));
        }

        return r;
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