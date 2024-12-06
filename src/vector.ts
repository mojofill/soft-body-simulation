export default class Vector {
    constructor(public x: number = 0, public y: number = 0) {}

    public get magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    public get theta() {
        return Math.atan2(this.y, this.x);
    }

    public get normalized() {
        return new Vector(this.x / this.magnitude, this.y / this.magnitude);
    }

    add(vector: Vector) {
        return new Vector(this.x + vector.x, this.y + vector.y);
    }

    /** returns `vectorB` - `vectorA` */
    static difference(vectorA: Vector, vectorB: Vector) {
        return new Vector(vectorB.x - vectorA.x, vectorB.y - vectorA.x);
    }

    static dotProduct(vA: Vector, vB: Vector) {
        return vA.x * vB.x + vA.y * vB.y;
    }

    multiply(n: number) {
        return new Vector(this.x * n, this.y * n);
    }

    copy() {
        return new Vector(this.x, this.y);
    }
}