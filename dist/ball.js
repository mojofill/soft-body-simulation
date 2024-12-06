"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const physicsObject_1 = require("./physicsObject");
const utils_1 = require("./utils");
class Ball extends physicsObject_1.PhysicsObject {
    constructor(cx, cy, r, theta, // useless for a ball, but it dont matter anyway
    mass, frictionCoefficient, anchored, color, ctx, name = "DEFAULT NO NAME") {
        super(cx, cy, { w: null, h: null, r: r }, theta, mass, frictionCoefficient, anchored, name);
        this.cx = cx;
        this.cy = cy;
        this.r = r;
        this.theta = theta;
        this.mass = mass;
        this.frictionCoefficient = frictionCoefficient;
        this.anchored = anchored;
        this.color = color;
        this.ctx = ctx;
        this.name = name;
    }
    render() {
        (0, utils_1.drawBall)(this.cx, this.cy, this.r, this.color, this.ctx);
    }
}
exports.default = Ball;
//# sourceMappingURL=ball.js.map