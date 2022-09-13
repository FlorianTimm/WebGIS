import { Map } from "ol";
import { Color } from "ol/color";
import BaseLayer from "ol/layer/Base";
import { ObjectEvent } from "ol/Object";
import Menu from "./Menu";

export class LayerMenu extends Menu {
    private map: Map;
    private layerButton: { radio: HTMLInputElement, radioLabel: HTMLLabelElement, layer: BaseLayer }[]

    constructor(map: Map, div?: HTMLElement) {
        super(div);
        this.map = map;
        this.layerButton = [];
        this.generateLayerOverview();
        this.map.on("change:layergroup", (event: ObjectEvent) => {
            console.log('Layer changed');
            console.log(event);
        })
    }

    public get name(): string {
        return "Layer";
    }

    private generateLayerOverview() {
        this.div.innerHTML = "";
        this.div.id = 'layerSwitcher'
        let layer = this.map.getLayers();
        this.layerButton = [];

        let backgroundLayer = document.createElement('div');
        backgroundLayer.id = 'backgroundLayer'
        let backgroundLayerHeader = document.createElement('h3');
        backgroundLayerHeader.innerHTML = 'Hintergrund'
        backgroundLayer.appendChild(backgroundLayerHeader)
        this.div.appendChild(backgroundLayer);

        let overlayLayer = document.createElement('div');
        overlayLayer.id = 'overlayLayer';
        let overlayLayerHeader = document.createElement('h3');
        overlayLayerHeader.innerHTML = 'Fachdaten'
        overlayLayer.appendChild(overlayLayerHeader)
        this.div.appendChild(overlayLayer);

        layer.forEach((layer) => {
            if (!layer.get("switchable")) {
                return
            }

            let radioLabel = document.createElement('label');
            let radio = document.createElement('input');
            radioLabel.appendChild(radio);
            radioLabel.appendChild(document.createTextNode(layer.get("name")));
            if (layer.get("backgroundLayer")) {
                radio.type = "radio";
                radio.name = 'backgroundLayer';
                backgroundLayer.appendChild(radioLabel);
            } else {
                radio.type = "checkbox";
                overlayLayer.appendChild(radioLabel);
            }
            radio.addEventListener('change', () => {
                this.layerButton.forEach((item) => {
                    item.layer.setVisible(item.radio.checked)

                    if (item.radio.checked) {
                        item.radioLabel.classList.add('checked')
                    } else {
                        item.radioLabel.classList.remove('checked')
                    }
                })
            });

            //this.div.appendChild(document.createElement('br'))
            if (layer.getVisible()) {
                radio.checked = true;
                radioLabel.classList.add('checked')
            }
            this.layerButton.push({ radio: radio, radioLabel: radioLabel, layer: layer })
        });

    }

    public get color(): Color {
        return [0, 200, 200]
    }

}