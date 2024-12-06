"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const physicsObject_1 = require("./physicsObject");
const utils_1 = require("./utils");
class Rect extends physicsObject_1.PhysicsObject {
    /** pass in the center (x, y) position of the rectangle */
    constructor(cx, cy, w, h, theta, mass, frictionCoefficient, anchored, color, ctx, name = "DEFAULT NO NAME") {
        super(cx, cy, { w: w, h: h, r: null }, theta, mass, frictionCoefficient, anchored, name);
        this.cx = cx;
        this.cy = cy;
        this.w = w;
        this.h = h;
        this.theta = theta;
        this.mass = mass;
        this.frictionCoefficient = frictionCoefficient;
        this.anchored = anchored;
        this.color = color;
        this.ctx = ctx;
        this.name = name;
    }
    render() {
        (0, utils_1.drawRect)(this.cx, this.cy, this.w, this.h, this.theta, this.color, this.ctx);
    }
}
exports.default = Rect;
//# sourceMappingURL=rect.js.map