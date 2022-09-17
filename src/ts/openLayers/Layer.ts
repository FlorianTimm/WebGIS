// SPDX-License-Identifier: GPL-3.0-or-later

import { Image, Layer, Tile, Vector, VectorTile } from "ol/layer";
import { Vector as VectorSource, Image as ImageSource } from "ol/source";
import { Options as ImageOptions } from "ol/layer/BaseImage";
import { Options as TileOptions } from "ol/layer/BaseTile";
import { Options as VectorOptions } from "ol/layer/BaseVector";
import TileSource from "ol/source/Tile";
import { Geometry } from "ol/geom";
import { Options as VectorTileOptions } from "ol/layer/VectorTile";

/**
 * OpenLayers: Interface TileOptions
 * @author Florian Timm, Landesbetrieb Geoinformation und Vermessung, Hamburg
 * @version 2019-06-05
 * @license GPL-3.0-or-later
*/

interface LayerSwitcherLayerOptions {
    name?: string;
    switchable?: boolean;
    backgroundLayer?: boolean;
}

export interface LayerSwitcherLayer extends LayerSwitcherLayerOptions, Layer {
}


/**
 * OpenLayers: TileLayer
 * @author Florian Timm, Landesbetrieb Geoinformation und Vermessung, Hamburg
 * @version 2019-06-05
 * @license GPL-3.0-or-later
*/
export class TileLayer<TileSourceType extends TileSource> extends Tile<TileSourceType> implements LayerSwitcherLayer {
    backgroundLayer: boolean = false;
    name: string = "";
    switchable: boolean = false;
    constructor(option: TileOptions<TileSourceType> & LayerSwitcherLayerOptions) {
        super(option);
        if (option.name != undefined)
            this.name = option.name;
        if (option.switchable != undefined)
            this.switchable = option.switchable;
        if (option.backgroundLayer != undefined)
            this.backgroundLayer = option.backgroundLayer;
    }
}


/**
 * OpenLayers: ImageLayer
 * @author Florian Timm, LGV HH 
 * @version 2019.06.05
 * @copyright MIT
 */
export class ImageLayer<ImageSourceType extends ImageSource> extends Image<ImageSourceType> implements LayerSwitcherLayer {
    backgroundLayer: boolean = false;
    name: string = "";
    switchable: boolean = false;
    constructor(option: ImageOptions<ImageSourceType> & LayerSwitcherLayerOptions) {
        super(option);
        if (option.name != undefined)
            this.name = option.name;
        if (option.switchable != undefined)
            this.switchable = option.switchable;
        if (option.backgroundLayer != undefined)
            this.backgroundLayer = option.backgroundLayer;
    }
}

/**
 * OpenLayers: VectorLayer
 * @author Florian Timm, LGV HH 
 * @version 2019.06.05
 * @copyright MIT
 */
export class VectorLayer<VectorSourceType extends VectorSource<Geometry>> extends Vector<VectorSourceType> implements LayerSwitcherLayer {
    backgroundLayer: boolean = false;
    name: string = "";
    switchable: boolean = false;
    constructor(option: VectorOptions<VectorSourceType> & LayerSwitcherLayerOptions) {
        super(option);
        if (option.name != undefined)
            this.name = option.name;
        if (option.switchable != undefined)
            this.switchable = option.switchable;
        if (option.backgroundLayer != undefined)
            this.backgroundLayer = option.backgroundLayer;
    }
}

/**
 * OpenLayers: VectorLayer
 * @author Florian Timm, LGV HH 
 * @version 2022.08.29
 * @copyright MIT
 */
export class VectorTileLayer extends VectorTile implements LayerSwitcherLayer {
    backgroundLayer: boolean = false;
    name: string = "";
    switchable: boolean = false;
    constructor(option: VectorTileOptions & LayerSwitcherLayerOptions) {
        super(option);
        if (option.name != undefined)
            this.name = option.name;
        if (option.switchable != undefined)
            this.switchable = option.switchable;
        if (option.backgroundLayer != undefined)
            this.backgroundLayer = option.backgroundLayer;
    }
}