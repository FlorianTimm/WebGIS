import { Map } from "ol";
import { Color } from "ol/color";
import BaseLayer from "ol/layer/Base";
import { ObjectEvent } from "ol/Object";
import Menu from "./Menu";

export class LayerMenu extends Menu {
    private map: Map;
    private layerButton: { radio: HTMLInputElement, layer: BaseLayer }[]

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

    public getName(): string {
        return "Layer";
    }

    private generateLayerOverview() {
        this.getDiv().innerHTML = "";
        let layer = this.map.getLayers();
        this.layerButton = [];
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
            } else {
                radio.type = "checkbox";
            }
            radio.addEventListener('change', () => {
                this.layerButton.forEach((item) => {
                    item.layer.setVisible(item.radio.checked)
                })
            });
            this.getDiv().appendChild(radioLabel);
            this.getDiv().appendChild(document.createElement('br'))
            if (layer.getVisible()) {
                radio.checked = true;
            }
            this.layerButton.push({ radio: radio, layer: layer })
        });

    }

    public getColor(): Color {
        return [0, 200, 200]
    }

}