export default class UAV {
    private name: string;
    private focus: number;
    private minspeed: number;
    private maxspeed: number;
    private curveRadius: number;

    private static uavs: UAV[];

    constructor(name: string, focus: number, curveRadius: number, maxspeed: number, minspeed: number) {
        this.name = name;
        this.focus = focus;
        this.curveRadius = curveRadius;
        this.maxspeed = maxspeed;
        this.minspeed = minspeed;
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

    }

    private toString() {
        return this.name;
    }
}