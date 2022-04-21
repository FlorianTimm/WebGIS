export default class UAV {
    private focus: number;
    private minspeed: number;
    private maxspeed: number;
    private curveRadius: number;

    constructor(focus: number, curveRadius: number, maxspeed: number, minspeed: number) {
        this.focus = focus;
        this.curveRadius = curveRadius;
        this.maxspeed = maxspeed;
        this.minspeed = minspeed;
    }
}