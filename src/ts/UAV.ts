import { string } from "mathjs";
import { textHeights } from "ol/render/canvas";

export default class UAV {
    private _name: string;
    private _focusLength: number;
    private _sensorSize: [number, number];
    private _sensorPixel: [number, number];
    private _minspeed: number;
    private _maxspeed: number;
    private _curveRadius: number;

    private static uavs: UAV[];
    private static uavsPromise: Promise<UAV[]>;
    private _id: number;

    constructor(name: string) {
        this._name = name;
    }

    static async getUAVs(): Promise<UAV[]> {
        if (UAV.uavsPromise === undefined) {
            this.uavsPromise = UAV.loadUAVs();
        };
        return this.uavsPromise
    }

    private static newUAV() {

    }

    private static async loadUAVs(): Promise<UAV[]> {
        const req = await fetch('/api/uav');
        const json = await req.json();
        let uavs = [];
        json.forEach((element: {
            id: number;
            name: string;
            curveradius: number;
            minspeed: number;
            maxspeed: number;
            sensorwidth: number;
            sensorheight: number;
            focuslength: number;
            sensorpixelwidth: number;
            sensorpixelheight: number;
        }) => {
            const testUAV = new UAV(element.name);
            testUAV.id = element.id;
            testUAV.curveRadius = element.curveradius ?? 0;
            testUAV.maxspeed = element.maxspeed ?? 0;
            testUAV.minspeed = element.minspeed ?? 50;
            testUAV.sensorPixel = [element.sensorpixelwidth, element.sensorpixelheight];
            testUAV.sensorSize = [element.sensorwidth, element.sensorheight];
            testUAV.focusLength = element.focuslength ?? 5;
            uavs.push(testUAV);
        });
        return uavs;
    }

    public toString() {
        return this._name;
    }


    // Getter/Setter
    public get focusLength(): number {
        return this._focusLength;
    }
    public set focusLength(value: number) {
        this._focusLength = value;
    }
    public get sensorSize(): [number, number] {
        return this._sensorSize;
    }
    public set sensorSize(value: [number, number]) {
        this._sensorSize = value;
    }
    public get sensorPixel(): [number, number] {
        return this._sensorPixel;
    }
    public set sensorPixel(value: [number, number]) {
        this._sensorPixel = value;
    }
    public get minspeed(): number {
        return this._minspeed;
    }
    public set minspeed(value: number) {
        this._minspeed = value;
    }
    public get maxspeed(): number {
        return this._maxspeed;
    }
    public set maxspeed(value: number) {
        this._maxspeed = value;
    }
    public get curveRadius(): number {
        return this._curveRadius;
    }
    public set curveRadius(value: number) {
        this._curveRadius = value;
    }
    public get id(): number {
        return this._id;
    }
    public set id(value: number) {
        this._id = value;
    }

    public get name(): string {
        return this._name;
    }
}