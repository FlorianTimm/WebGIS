class Point {
    constructor(x, y) {
        this._x = x;
        this._y = y;
    }

    get x() {
        return this._x
    }
    get y() {
        return this._y;
    }
    set x(x) {
        this._x = x;
    }
    set y(y) {
        this._y = y;
    }

    show() {
        return `${this._x} ${this._y}`;
    }
}

class POI extends Point {
    constructor(name, x, y) {
        super(x, y);
        this._name = name;
    }

    show() {
        return `${this._name}: ${this._x} ${this._y}`;
    }
}