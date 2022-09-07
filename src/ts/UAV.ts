export interface UAVdata {
    id?: number;
    name: string;
    curveradius?: number;
    minspeed?: number;
    maxspeed?: number;
    sensorwidth: number;
    sensorheight: number;
    focuslength: number;
    sensorpixelwidth: number;
    sensorpixelheight: number;
}

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

    private static callbacks: ((liste: UAV[]) => void)[] = [];

    private constructor(element: UAVdata) {
        this.id = element.id;
        this._name = element.name;
        this._focusLength = element.focuslength ?? 5;
        this._sensorSize = [element.sensorwidth, element.sensorheight];
        this._sensorPixel = [element.sensorpixelwidth, element.sensorpixelheight];

        this.curveRadius = element.curveradius ?? this._curveRadius;
        this.maxspeed = element.maxspeed ?? this.maxspeed;
        this.minspeed = element.minspeed ?? this.minspeed;
    }

    static async getUAVs(): Promise<UAV[]> {
        if (UAV.uavsPromise === undefined) {
            this.uavsPromise = UAV.loadUAVs();
        };
        return this.uavsPromise
    }

    public static onChange(callback: (liste: UAV[]) => void) {
        UAV.callbacks.push(callback)
    }

    private static informObserver() {
        UAV.callbacks.forEach(async (callback) => {
            callback(await UAV.uavsPromise)
        });
    }


    public static createUAV(data: UAVdata): Promise<UAV> {
        return fetch('/api/uav', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
        })
            .then(req => {
                if (req.status != 201) {
                    if (req.status == 409) {
                        alert("Konnte Datensatz nicht einfügen (Namenskonflikt)")
                    } else {
                        alert("Fehler beim Einfügen!")
                    }
                    return Promise.reject();
                }
                return req
            })
            .then(req => req.json())
            .then(async (json: UAVdata) => {
                let uav = new UAV(json);
                (await this.getUAVs()).push(uav)
                UAV.informObserver();
                return uav;
            })
    }


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
                json.forEach((element: UAVdata) => {
                    uavs.push(new UAV(element));
                    UAV.informObserver();
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
        UAV.informObserver();
        this._focusLength = value;
    }
    public get sensorSize(): [number, number] {
        return this._sensorSize;
    }
    public set sensorSize(value: [number, number]) {
        UAV.informObserver();
        this._sensorSize = value;
    }
    public get sensorPixel(): [number, number] {
        return this._sensorPixel;
    }
    public set sensorPixel(value: [number, number]) {
        this._sensorPixel = value;
        UAV.informObserver();
    }
    public get minspeed(): number {
        return this._minspeed;
    }
    public set minspeed(value: number) {
        this._minspeed = value;
        UAV.informObserver();
    }
    public get maxspeed(): number {
        return this._maxspeed;
    }
    public set maxspeed(value: number) {
        this._maxspeed = value;
        UAV.informObserver();
    }
    public get curveRadius(): number {
        return this._curveRadius;
    }
    public set curveRadius(value: number) {
        this._curveRadius = value;
        UAV.informObserver();
    }
    public get id(): number | undefined {
        return this._id;
    }
    public set id(value: number | undefined) {
        this._id = value;
        UAV.informObserver();
    }

    public get name(): string {
        return this._name;
    }
}