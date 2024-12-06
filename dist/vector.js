"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Vector {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    get magnitude() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }
    get theta() {
        return Math.atan2(this.y, this.x);
    }
    get normalized() {
        return new Vector(this.x / this.magnitude, this.y / this.magnitude);
    }
    add(vector) {
        return new Vector(this.x + vector.x, this.y + vector.y);
    }
    /** returns `vectorB` - `vectorA` */
    static difference(vectorA, vectorB) {
        return new Vector(vectorB.x - vectorA.x, vectorB.y - vectorA.x);
    }
    static dotProduct(vA, vB) {
        return vA.x * vB.x + vA.y * vB.y;
    }
    multiply(n) {
        return new Vector(this.x * n, this.y * n);
    }
    copy() {
        return new Vector(this.x, this.y);
    }
}
exports.default = Vector;
//# sourceMappingURL=vector.js.map