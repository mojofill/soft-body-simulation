"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhysicsObject = void 0;
const force_1 = __importDefault(require("./force"));
const utils_1 = require("./utils");
const vector_1 = __importDefault(require("./vector"));
class PhysicsObject {
    constructor(cx, cy, dimension, theta, mass, frictionCoefficient, anchored, name = "DEFAULT NO NAME") {
        this.cx = cx;
        this.cy = cy;
        this.dimension = dimension;
        this.theta = theta;
        this.mass = mass;
        this.frictionCoefficient = frictionCoefficient;
        this.anchored = anchored;
        this.name = name;
        this.forces = [];
        // TODO: torque + rotation
        this.v = new vector_1.default(0, 0);
        this.w = null;
        this.h = null;
        this.r = null;
        this.gravityToggle = true;
        this.save_x = 0; // saves position of object in previous frame
        this.save_y = 0; // saves position of object in previous frame
        this.save_v = new vector_1.default();
    }
    applyPhysics(objects, dt, ctx) {
        if (this.anchored)
            return; // if it is anchored, then no physics are to applied as all forces will cancel out
        this.forces = [];
        if (this.gravityToggle)
            this.forces.push(new force_1.default(this.mass * utils_1.g, -Math.PI / 2));
        const collidedObjects = this.collisionDetect(objects, ctx);
        if (collidedObjects !== null) {
            // apply delta p = 0 !!!!!!!!!!!!!!!!!!!!!!!
            // TODO: do delta p = 0 for multiple objects - its probably just vector addition
            // just so i can see something happen, just ignore the fact that it might perfectly hit a corner and cause some weird vector stuff
            this.restore(); // go back to previous position
            for (let i = 0; i < collidedObjects.length; i++) {
                const object = collidedObjects[i];
                if (object.anchored) { // this means that this object cannot be moved
                    this.v.y *= -1;
                    this.v.x *= -1;
                }
            }
        }
        else {
            // cuz theres no collisions happening i can apply all forces now
            for (const force of this.forces) {
                this.applyForce(force, dt);
            }
        }
        this.cx += this.v.x * dt;
        this.cy += this.v.y * dt;
        this.save();
    }
    save() {
        this.save_x = this.cx;
        this.save_y = this.cy;
        this.save_v = this.v;
    }
    restore() {
        this.cx = this.save_x;
        this.cy = this.save_y;
        this.v = this.save_v;
    }
    /** force will act on this object */
    applyForce(force, dt) {
        let vector = force.vector.copy();
        vector = vector.multiply(dt / this.mass);
        this.v = this.v.add(vector);
    }
    /** when object collides with another object, then internal forces will be applied
     *
     * returns `null` if the object has collided with nothing
     * return a `PhysicsObject[]` if the object HAS collided with something
    */
    collisionDetect(objects, ctx) {
        let objectsCollidedWith = [];
        for (let i = 0; i < objects.length; i++) {
            const object = objects[i];
            if (object === this)
                continue; // cannot collide with itself
            // DECIDED NO COLLISION DETECTION BETWEEN CIRCLES
            // // circle and circle collision detect
            // if (this.isCircle && object.isCircle) {
            //     if (this.r === null || object.r === null) throw new Error("how u this stupid and gave a ball with no radius.");
            //     if (collisionCircelAndCircle({x: this.cx, y: this.cy, r: this.r}, {x: object.cx, y: object.cy, r: object.r})) {
            //         objectsCollidedWith.push(object);
            //     }
            // }
            // this circle and object rect collision detect
            if (this.isCircle && object.isRect) {
                if (this.r === null || (object.w === null || object.h === null))
                    throw new Error("how u this stupid bruh. this probably gonna be a very unhelpful error message.");
                if ((0, utils_1.collisionCircleAndRectangle)({ x: this.cx, y: this.cy, r: this.r }, { x: object.cx, y: object.cy, w: object.w, h: object.h }, ctx)) {
                    objectsCollidedWith.push(object);
                }
            }
            // this rect and object circle collision detect
            if (object.isCircle && this.isRect) {
                if ((this.w === null || this.h === null) || object.r === null)
                    throw new Error("how u this stupid bruh. this probably gonna be a very unhelpful error message. this is the second one of its kind.");
                if ((0, utils_1.collisionCircleAndRectangle)({ x: object.cx, y: object.cy, r: object.r }, { x: this.cx, y: this.cy, w: this.w, h: this.h }, ctx)) {
                    objectsCollidedWith.push(object);
                }
            }
        }
        return objectsCollidedWith.length === 0 ? null : objectsCollidedWith;
    }
    get isCircle() {
        return this.dimension.r !== null;
    }
    get isRect() {
        return this.dimension.w !== null && this.dimension.h !== null;
    }
    addForce(...forces) {
        for (const force of forces) {
            this.forces.push(force);
        }
    }
}
exports.PhysicsObject = PhysicsObject;
//# sourceMappingURL=physicsObject.js.map