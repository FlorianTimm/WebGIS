// SPDX-License-Identifier: GPL-3.0-or-later

import { Image, Tile, Vector } from "ol/layer";
import { Vector as VectorSource, Image as ImageSource } from "ol/source";
import { Options as ImageOptionsOl } from "ol/layer/BaseImage";
import { Options as TileOptionsOl } from "ol/layer/BaseTile";
import { Options as VectorOptionsOl } from "ol/layer/BaseVector";
import TileSource from "ol/source/Tile";
import { Geometry } from "ol/geom";

/**
 * OpenLayers: Interface TileOptions
 * @author Florian Timm, Landesbetrieb Geoinformation und Vermessung, Hamburg
 * @version 2019-06-05
 * @license GPL-3.0-or-later
*/
export interface TileOptions<TileSourceType extends TileSource> extends TileOptionsOl<TileSourceType> {
    name?: string;
    switchable?: boolean;
    backgroundLayer?: boolean;
}

/**
 * OpenLayers: TileLayer
 * @author Florian Timm, Landesbetrieb Geoinformation und Vermessung, Hamburg
 * @version 2019-06-05
 * @license GPL-3.0-or-later
*/
export class TileLayer<TileSourceType extends TileSource> extends Tile<TileSourceType> {
    name: string = "";
    switchable: boolean = false;
    backgroundLayer: boolean = false;

    constructor(option: TileOptions<TileSourceType>) {
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
 * OpenLayers: Interface ImageOptions
 * @author Florian Timm, LGV HH 
 * @version 2019.06.05
 * @copyright MIT
 */
export interface ImageOptions<ImageSourceType extends ImageSource> extends ImageOptionsOl<ImageSourceType> {
    name?: string;
    switchable?: boolean;
    backgroundLayer?: boolean;
}

/**
 * OpenLayers: ImageLayer
 * @author Florian Timm, LGV HH 
 * @version 2019.06.05
 * @copyright MIT
 */
export class ImageLayer<ImageSourceType extends ImageSource> extends Image<ImageSourceType> {
    name: string = "";
    switchable: boolean = false;
    backgroundLayer: boolean = false;

    constructor(option: ImageOptions<ImageSourceType>) {
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
 * OpenLayers: Interface VectorOptions
 * @author Florian Timm, LGV HH 
 * @version 2019.06.05
 * @copyright MIT
 */
export interface VectorOptions<VectorSourceType extends VectorSource<Geometry>> extends VectorOptionsOl<VectorSourceType> {
    name?: string;
    switchable?: boolean;
    backgroundLayer: boolean;
}

/**
 * OpenLayers: VectorLayer
 * @author Florian Timm, LGV HH 
 * @version 2019.06.05
 * @copyright MIT
 */
export class VectorLayer<VectorSourceType extends VectorSource<Geometry>> extends Vector<VectorSourceType> {
    name: string = "";
    switchable: boolean = false;
    backgroundLayer: boolean = false;

    constructor(option: VectorOptions<VectorSourceType>) {
        super(option);
        if (option.name != undefined)
            this.name = option.name;
        if (option.switchable != undefined)
            this.switchable = option.switchable;
        if (option.backgroundLayer != undefined)
            this.backgroundLayer = option.backgroundLayer;
    }
}