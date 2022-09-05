import { Feature } from "ol";
import { Point, Polygon } from "ol/geom";
import { Draw, Modify } from "ol/interaction";
import { DrawEvent } from "ol/interaction/Draw";
import Map from "../Map";
import TrajectoryCalc from "../TrajectoryCalc";
import UAV from "../UAV";
import HTML, { HTMLSelectElementArray } from "./HTML";
import WKT from "ol/format/WKT"
import { ModifyEvent } from "ol/interaction/Modify";
import { GPX, KML } from "ol/format";
import XMLFeature from "ol/format/XMLFeature";

type Config = {
    uav: number,
    ausrichtung: number,
    aufloesung: number,
    ueberlappungLaengs: number,
    ueberlappungQuer: number,
    gebiet: string,
    hoehenBegrenzung: 0 | 10 | 50 | 120
}

export default class Zeichnen extends Draw {
    private _button: HTMLInputElement;
    private _ausrichtungSlider: HTMLInputElement;
    private _map: Map;
    private _tc: TrajectoryCalc;
    private _gebiet: Feature<Polygon> | undefined;
    private _ueberlappungLaengsSlider: HTMLInputElement;
    private _ueberlappungQuerSlider: HTMLInputElement;
    private _aufloesungSlider: HTMLInputElement;
    private _uavSelect: HTMLSelectElementArray<UAV>;
    private _hoeheBegrenzen: HTMLInputElement;
    private _flugHoeheInput: HTMLInputElement;
    private _flugLaengeInput: HTMLInputElement;
    private _flugDauerInput: HTMLInputElement;
    private _bildAnzahlInput: HTMLInputElement;

    constructor(map: Map, menuBereich: HTMLElement) {
        super({
            type: 'Polygon',
            source: map.getZeichenSource()
        });
        this._map = map;

        this._uavSelect = HTML.createSelect(menuBereich, "UAV", UAV.getUAVs());
        this._button = HTML.createButton(menuBereich, "Gebiet zeichnen");
        this._ausrichtungSlider = HTML.createSlider(menuBereich, "Ausrichtung", 0, 360, 0, 5);
        this._aufloesungSlider = HTML.createSlider(menuBereich, "Auflösung [cm/px]", 1, 20, 10, 1);
        this._ueberlappungLaengsSlider = HTML.createSlider(menuBereich, "Überlappung längs [%]", 0, 90, 50, 5);
        this._ueberlappungQuerSlider = HTML.createSlider(menuBereich, "Überlappung quer [%]", 0, 90, 50, 5);
        this._hoeheBegrenzen = HTML.createCheckbox(menuBereich, "120m-Begrenzung")


        this._flugHoeheInput = HTML.createNumberInput(menuBereich, "Flughöhe", undefined, true);
        this._flugLaengeInput = HTML.createNumberInput(menuBereich, "Fluglänge", undefined, true);
        this._flugDauerInput = HTML.createInput(menuBereich, "Flugdauer", undefined, true);
        this._bildAnzahlInput = HTML.createNumberInput(menuBereich, "Bilder", undefined, true);


        this.on("drawend", (event: DrawEvent) => {
            this.zeichnen_beenden();
            this._gebiet = <Feature<Polygon>>event.feature;
            this.gebietUebergeben();
        })
        this.setActive(false)
        this._map.addInteraction(this)

        let modify = new Modify({ source: map.getZeichenSource() })
        modify.setActive(true)
        modify.on('modifyend', (event: ModifyEvent) => {
            console.log(<Feature<Polygon>>event.features.getArray()[0])
            this._gebiet = this._map.getZeichenSource().getFeatures()[0]
            this.gebietUebergeben()
        });
        this._map.addInteraction(modify);

        this._tc = new TrajectoryCalc(this._map, this.setFlightParameter.bind(this));

        this._button.addEventListener('click', () => {
            console.log("Zeichnen");
            this.button_click()
        })

        this._ausrichtungSlider.addEventListener('change', this.ausrichtungUebergeben.bind(this))
        this._ueberlappungLaengsSlider.addEventListener('change', this.ueberlappungLaengsUebergeben.bind(this))
        this._ueberlappungQuerSlider.addEventListener('change', this.ueberlappungQuerUebergeben.bind(this))
        this._aufloesungSlider.addEventListener('change', this.aufloesungUebergeben.bind(this))
        this._uavSelect.getHTMLElement().addEventListener('change', this.uavUebergeben.bind(this))
        this._hoeheBegrenzen.addEventListener('change', this.hoehenBegrenzungUebergeben.bind(this))
    }



    public setFlightParameter(hoehe: number, laenge: number, dauer: number, anzahl: number) {
        this._flugHoeheInput.value = hoehe.toFixed(1);
        this._flugLaengeInput.value = laenge.toFixed(3);
        this._flugDauerInput.value = dauer.toFixed(1);
        this._bildAnzahlInput.value = anzahl.toFixed(0);
    }

    private gebietUebergeben(): boolean {
        if (!this._gebiet) return false;
        let g = this._gebiet.getGeometry();
        if (!g) return false;
        this._tc.gebiet = g;
        return true
    }

    private hoehenBegrenzungUebergeben() {
        this._tc.hoeheBegrenzen = this._hoeheBegrenzen.checked;
    }

    private async uavUebergeben() {
        this._tc.uav = await this._uavSelect.getSelectedEntry();
    }

    private ueberlappungLaengsUebergeben() {
        this._tc.ueberlappungLaengs = parseInt(this._ueberlappungLaengsSlider.value) / 100;
    }

    private ueberlappungQuerUebergeben() {
        this._tc.ueberlappungQuer = parseInt(this._ueberlappungQuerSlider.value) / 100;
    }

    private ausrichtungUebergeben() {
        this._tc.ausrichtung = parseInt(this._ausrichtungSlider.value);
    }

    private aufloesungUebergeben() {
        this._tc.aufloesung = parseInt(this._aufloesungSlider.value) / 100;
    }

    private zeichnen_beenden() {
        this._button.value = "Gebiet zeichnen";
        this.setActive(false);
        this._map.setDoubleClickZoom(true);
    }

    private zeichnen_starten() {
        this._button.value = "Zeichnen abbrechen";
        this.setActive(true);
        this._map.getZeichenSource().clear();
        this._map.setDoubleClickZoom(false);
    }

    private button_click() {
        if (this.getActive()) {
            this.zeichnen_beenden();
        } else {
            this.zeichnen_starten();
        }
    }

    public async getConfig(): Promise<Config> {
        let format = new WKT();
        if (!this._gebiet) throw Error("Projekt-Gebiet nicht definiert!");
        let geom = this._gebiet.getGeometry()
        let wkt: string;
        if (!geom) throw Error("Projekt-Gebiet nicht definiert!");
        wkt = format.writeGeometry(geom);
        let uavId = (await this._uavSelect.getSelectedEntry()).id
        if (!uavId) throw Error("Projekt-Gebiet nicht definiert!");
        return {
            uav: uavId,
            ausrichtung: parseInt(this._ausrichtungSlider.value),
            aufloesung: parseInt(this._aufloesungSlider.value) / 100,
            ueberlappungLaengs: parseInt(this._ueberlappungLaengsSlider.value) / 100,
            ueberlappungQuer: parseInt(this._ueberlappungQuerSlider.value) / 100,
            gebiet: wkt,
            hoehenBegrenzung: this._hoeheBegrenzen.checked ? 120 : 0
        }
    }

    public async setConfig(option: Config) {

        this._uavSelect.setSelection((element) => {
            return element.id == option.uav
        });
        this._uavSelect.getHTMLElement().dispatchEvent(new Event('change'))

        if (option.gebiet != '') {
            let format = new WKT();
            let wkt = <Polygon>format.readGeometry(option.gebiet);
            this._gebiet = new Feature(wkt);
            this._map.getZeichenSource().addFeature(this._gebiet);
            this.gebietUebergeben()
            this._map.getView().fit(wkt, {
                maxZoom: 18,
                padding: [50, 50, 50, 50]
            })
        }
        this._ausrichtungSlider.value = option.ausrichtung.toString();
        this._ausrichtungSlider.dispatchEvent(new Event('change'))
        this._aufloesungSlider.value = (option.aufloesung * 100).toString();
        this._aufloesungSlider.dispatchEvent(new Event('change'))
        this._ueberlappungLaengsSlider.value = (option.ueberlappungLaengs * 100).toString();
        this._ueberlappungLaengsSlider.dispatchEvent(new Event('change'))
        this._ueberlappungQuerSlider.value = (option.ueberlappungQuer * 100).toString();
        this._ueberlappungQuerSlider.dispatchEvent(new Event('change'))
        this._hoeheBegrenzen.checked = (option.hoehenBegrenzung == 120);
        this._hoeheBegrenzen.dispatchEvent(new Event('change'))
    }

    public exportTrajectory(art: 'KML' | 'GPX') {
        console.log("Export")
        let trajectory = this._map.getTrajectorySource().getFeatures()
        let point = trajectory.filter((feature) => {
            let g = feature.getGeometry()
            if (g !== undefined && g.getType() == 'Point') return feature
            else return null;
        });

        let link = document.createElement('a');
        let xmlData: XMLFeature;
        if (art == 'GPX') {
            xmlData = new GPX();
            link.download = 'datei.gpx';
        } else {
            xmlData = new KML();
            link.download = 'datei.kml';
        }
        let geom4326: Feature<Point>[] = [];
        point.forEach((feature: Feature) => {
            let f = <Feature<Point>>feature.clone()
            f.getGeometry()?.transform('EPSG:3857', 'EPSG:4326')
            geom4326.push(f);
        })
        let xmlDataTxt = xmlData.writeFeatures(geom4326);
        link.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(xmlDataTxt);
        link.click()
    }
}
