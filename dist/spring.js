"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Spring = void 0;
const force_1 = __importDefault(require("./force"));
const vector_1 = __importDefault(require("./vector"));
/** the equillibium */
class Spring extends force_1.default {
    /** `b` is the spring constant, `c` is the damping constant */
    constructor(obj1, obj2, k, c, ctx) {
        super(0, 0); // spring force doesnt make sense to have direction or magnitude, as these are calculated
        this.obj1 = obj1;
        this.obj2 = obj2;
        this.k = k;
        this.c = c;
        this.ctx = ctx;
        this.equilibrium = Math.sqrt((obj2.cx - obj1.cx) ** 2 + (obj2.cy - obj1.cy) ** 2);
    }
    render() {
        const height = this.ctx.canvas.height;
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(this.obj1.cx, height - this.obj1.cy);
        this.ctx.lineTo(this.obj2.cx, height - this.obj2.cy);
        this.ctx.stroke();
    }
    get deltaX() {
        // the formula is: F_spring = k * delta_x
        // delta_x is the abs value difference of the equilibrium length and the distance between the two objects at this current frame
        // this is the obj dist at this current frame
        const objDist = Math.sqrt((this.obj2.cx - this.obj1.cx) ** 2 + (this.obj2.cy - this.obj1.cy) ** 2);
        return objDist - this.equilibrium;
    }
    /** applies spring physics to both `obj1` and `obj2` */
    applySpringPhysics(dt) {
        // CASE I: obj1 is not anchored
        if (!this.obj1.anchored) {
            // get direction to the other object
            const directionVector = new vector_1.default(this.obj2.cx - this.obj1.cx, this.obj2.cy - this.obj1.cy);
            // scale it down by the magnitude of force to get the spring force
            const springForce = new force_1.default(this.k * this.deltaX, Math.atan2(directionVector.y, directionVector.x));
            // apply this spring force to obj1
            this.obj1.applyForce(springForce, dt);
            // now apply damping
            // referring to this video: https://youtu.be/kyQP4t_wOGI
            // first get the speed at which the spring is expanding
            // get the normalized direction vector between obj2 and obj1
            const normalizedDirectionVector = directionVector.normalized;
            // find the velocity difference (B - A)
            // i can probably make this cleaner with a method for subtracting but whatever
            const velocityDifference = new vector_1.default(this.obj2.v.x - this.obj1.v.x, this.obj2.v.y - this.obj1.v.y);
            const dampingDirection = vector_1.default.dotProduct(normalizedDirectionVector, velocityDifference);
            const theta = (dampingDirection < 0 ? Math.PI : 0) + normalizedDirectionVector.theta; // flip theta if damping direction is negative
            // abs value of damping direction because we need the magnitude
            const dampingForce = new force_1.default(normalizedDirectionVector.multiply(Math.abs(dampingDirection) * this.c).magnitude, theta);
            this.obj1.applyForce(dampingForce, dt);
        }
        // CASE II: obj2 is not anchored
        // copied from CASE I for sake of development time (im just too lazy)
        // read comments for CASE I to understand this code
        if (!this.obj2.anchored) {
            // flippped obj1 and obj2 for the direction, everything else is the same as CASE I
            const directionVector = new vector_1.default(this.obj1.cx - this.obj2.cx, this.obj1.cy - this.obj2.cy);
            const springForce = new force_1.default(this.k * this.deltaX, Math.atan2(directionVector.y, directionVector.x));
            this.obj2.applyForce(springForce, dt);
            const normalizedDirectionVector = directionVector.normalized;
            const velocityDifference = new vector_1.default(this.obj1.v.x - this.obj2.v.x, this.obj1.v.y - this.obj2.v.y);
            const dampingDirection = vector_1.default.dotProduct(normalizedDirectionVector, velocityDifference);
            const theta = (dampingDirection < 0 ? Math.PI : 0) + normalizedDirectionVector.theta;
            const dampingForce = new force_1.default(normalizedDirectionVector.multiply(Math.abs(dampingDirection) * this.c).magnitude, theta);
            this.obj2.applyForce(dampingForce, dt);
        }
        // CASE III: both are not anchored. wait this is actually already taken care of. all good i dont need to make anymore spaghetti code
        this.obj1.cx += this.obj1.v.x * dt;
        this.obj1.cy += this.obj1.v.y * dt;
        this.obj2.cx += this.obj2.v.x * dt;
        this.obj2.cy += this.obj2.v.y * dt;
    }
}
exports.Spring = Spring;
//# sourceMappingURL=spring.js.map