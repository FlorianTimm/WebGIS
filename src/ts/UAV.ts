export default class UAV {
    private _name: string;
    private _focusLength: number;
    private _sensorSize: [number, number];
    private _sensorPixel: [number, number];
    private _minspeed: number;
    private _maxspeed: number;
    private _curveRadius: number;

    private static uavs: UAV[];

    constructor(name: string) {
        this._name = name;
    }

    static getUAVs(): UAV[] {
        if (UAV.uavs == undefined) {
            UAV.loadUAVs();
        };
        return this.uavs;
    }

    private static saveUAVs() {
    }

    private static loadUAVs() {
        this.uavs = [];


        const testUAV = new UAV('DJI Mini 3 Pro')
        testUAV.curveRadius = 50;
        testUAV.maxspeed = 16;
        testUAV.curveRadius = 1;
        testUAV.minspeed = 0;
        testUAV.sensorPixel = [8064, 6048];
        testUAV.sensorSize = [0.007153, 0.009846]
        testUAV.focusLength = 0.00665
        this.uavs.push(testUAV)
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
}