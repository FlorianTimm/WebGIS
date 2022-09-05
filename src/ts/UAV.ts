export default class UAV {
    private _name: string;
    private _focusLength: number;
    private _sensorSize: [number, number];
    private _sensorPixel: [number, number];
    private _minspeed: number = 0;
    private _maxspeed: number = 19 * 3.6;
    private _curveRadius: number = 0;

    private static uavsPromise: Promise<UAV[]>;
    private _id: number | undefined;

    constructor(name: string, focusLength: number, sensorSize: [number, number], sensorPixel: [number, number]) {
        this._name = name;
        this._focusLength = focusLength;
        this._sensorPixel = sensorPixel;
        this._sensorSize = sensorSize;
    }

    static async getUAVs(): Promise<UAV[]> {
        if (UAV.uavsPromise === undefined) {
            this.uavsPromise = UAV.loadUAVs();
        };
        return this.uavsPromise
    }

    /*
    private static newUAV() {

    }
    */

    private static async loadUAVs(): Promise<UAV[]> {
        return fetch('/api/uav')
            .then((req) => {
                if (req.status != 200)
                    return fetch('/uav.json')
                return req;
            })
            .then(req => req.json())
            .then((json) => {
                let uavs: UAV[] = [];
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
                    const testUAV = new UAV(
                        element.name, element.focuslength ?? 5,
                        [element.sensorwidth, element.sensorheight],
                        [element.sensorpixelwidth, element.sensorpixelheight]);
                    testUAV.id = element.id;
                    testUAV.curveRadius = element.curveradius ?? 0;
                    testUAV.maxspeed = element.maxspeed ?? 0;
                    testUAV.minspeed = element.minspeed ?? 50;
                    uavs.push(testUAV);
                });
                return uavs;
            })

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
    public get id(): number | undefined {
        return this._id;
    }
    public set id(value: number | undefined) {
        this._id = value;
    }

    public get name(): string {
        return this._name;
    }
}