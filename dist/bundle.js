(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{"./physicsObject":4,"./utils":7}],2:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vector_1 = __importDefault(require("./vector"));
class Force {
    /** theta in degrees cuz thats shorter to write in */
    constructor(magnitude, theta) {
        this.vector = new vector_1.default();
        this.vector.x = magnitude * Math.cos(theta);
        this.vector.y = magnitude * Math.sin(theta);
    }
    get magnitude() {
        return this.vector.magnitude;
    }
}
exports.default = Force;

},{"./vector":8}],3:[function(require,module,exports){
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ball_1 = __importDefault(require("./ball"));
const rect_1 = __importDefault(require("./rect"));
const spring_1 = require("./spring");
const vector_1 = __importDefault(require("./vector"));
const canvas = document.getElementById('canvas');
if (!canvas || !(canvas instanceof HTMLCanvasElement))
    throw new Error('canvas not found');
const ctx = canvas.getContext('2d');
if (!ctx || !(ctx instanceof CanvasRenderingContext2D))
    throw new Error('ctx not found');
const slow_speed = 2;
const time = {
    curr: new Date().getTime() / (1000 * 10 ** (slow_speed - 1)),
    past: new Date().getTime() / (1000 * 10 ** (slow_speed - 1)),
    get dt() {
        return this.curr - this.past > 0.05 ? 0 : this.curr - this.past;
    },
    update() {
        this.past = this.curr;
        this.curr = new Date().getTime() / (1000 * 10 ** (slow_speed - 1));
    }
};
const objects = [];
const springs = [];
const init = () => {
    // full screen the canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.width = canvas.width + 'px';
    canvas.style.height = canvas.height + 'px';
    canvas.style.top = canvas.style.left = canvas.style.margin = '0px';
    canvas.style.position = 'fixed';
    const ball_arr = [];
    const w = 10;
    const h = 10;
    const start_x = 0.5 * canvas.width - 100;
    const start_y = 0.5 * canvas.height - 150;
    const start_v_x = 100;
    const start_v_y = -10;
    const r = 5;
    const k = 5000;
    const c = 30;
    const m = 1;
    const dist = 30;
    for (let y = 0; y < h; y++) {
        ball_arr.push([]);
        for (let x = 0; x < w; x++) {
            const ball = new ball_1.default(start_x + dist * x, start_y + dist * y, r, 0, m, 0, false, "white", ctx);
            ball.v = new vector_1.default(start_v_x, start_v_y);
            ball_arr[y].push(ball);
        }
    }
    for (let y = 0; y < ball_arr.length; y++) {
        for (let x = 0; x < ball_arr[y].length; x++) {
            // connect to the ball to the right, down, up_right, and down_right
            // if the object has no neighbors right, then dont connect
            // if the object has no neighbors up, then dont connect
            // if the object has no neighbors up and right, then dont connect
            // if the object has no neighbors down and right, then dont connect
            const curr_ball = ball_arr[y][x];
            const ball_right = x === ball_arr[y].length - 1 ? null : ball_arr[y][x + 1];
            const ball_up = y === ball_arr.length - 1 ? null : ball_arr[y + 1][x];
            const ball_up_right = (ball_right !== null && ball_up !== null) ? ball_arr[y + 1][x + 1] : null;
            const ball_down_right = (ball_right !== null && y - 1 >= 0) ? ball_arr[y - 1][x + 1] : null;
            let spring1 = null; // this and right
            let spring2 = null; // this and up
            let spring3 = null; // this and up_right
            let spring4 = null; // this and down_right
            if (ball_right !== null)
                spring1 = new spring_1.Spring(curr_ball, ball_right, k, c, ctx);
            if (ball_up !== null)
                spring2 = new spring_1.Spring(curr_ball, ball_up, k, c, ctx);
            if (ball_up_right !== null)
                spring3 = new spring_1.Spring(curr_ball, ball_up_right, k, c, ctx);
            if (ball_down_right !== null)
                spring4 = new spring_1.Spring(curr_ball, ball_down_right, k, c, ctx);
            if (spring1 !== null)
                springs.push(spring1);
            if (spring2 !== null)
                springs.push(spring2);
            if (spring3 !== null)
                springs.push(spring3);
            if (spring4 !== null)
                springs.push(spring4);
            objects.push(ball_arr[y][x]);
        }
    }
    const rect1 = new rect_1.default(0.5 * canvas.width, 0.5 * canvas.height - 200, 1000, 20, 0, 1, 0, true, "white", ctx);
    const rect2 = new rect_1.default(0.5 * canvas.width + 500, 0.5 * canvas.height + 1000, 20, 1000, 0, 1, 0, true, "white", ctx);
    const rect3 = new rect_1.default(0.5 * canvas.width - 500, 0.5 * canvas.height + 1000, 20, 1000, 0, 1, 0, true, "white", ctx);
    const rect4 = new rect_1.default(0.5 * canvas.width, 0.5 * canvas.height + 300, 1000, 20, 0, 1, 0, true, "white", ctx);
    objects.push(rect1, rect2, rect3, rect4);
    // start animation loop
    requestAnimationFrame(loop);
};
const loop = () => {
    // refresh the screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // update time
    time.update();
    for (const object of objects) {
        object.applyPhysics(objects, time.dt, ctx);
        object.render();
    }
    for (const spring of springs) {
        spring.applySpringPhysics(time.dt);
        spring.render();
    }
    // loop the animation
    requestAnimationFrame(loop);
};
// probably gonna need to do a bit of json hacks here and there
init();

},{"./ball":1,"./rect":5,"./spring":6,"./vector":8}],4:[function(require,module,exports){
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

},{"./force":2,"./utils":7,"./vector":8}],5:[function(require,module,exports){
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

},{"./physicsObject":4,"./utils":7}],6:[function(require,module,exports){
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

},{"./force":2,"./vector":8}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.collisionCircelAndCircle = exports.collisionCircleAndRectangle = exports.drawBall = exports.drawRect = exports.drawCircle = exports.g = void 0;
exports.g = 50;
function drawCircle(x, y, r, color, ctx) {
    ctx.beginPath();
    ctx.arc(x, ctx.canvas.height - y, r, 0, 2 * Math.PI);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.stroke();
    ctx.fill();
}
exports.drawCircle = drawCircle;
function drawRect(cx, cy, w, h, theta, color, ctx) {
    // save current position
    ctx.save();
    // transform to the center point
    ctx.translate(cx, cy);
    ctx.rotate(theta);
    // transform back
    ctx.translate(-cx, -cy);
    // color it in
    ctx.fillStyle = color;
    ctx.fillRect(cx - w / 2, ctx.canvas.height - cy + h / 2, w, h);
    // restore original pose
    ctx.restore();
}
exports.drawRect = drawRect;
function drawBall(cx, cy, r, color, ctx) {
    ctx.beginPath();
    ctx.arc(cx, ctx.canvas.height - cy, r, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();
}
exports.drawBall = drawBall;
;
/** this one gonna be tough! (i think)
 *
 * too much math and thinking, so i just copy this guy's work
 *
 * https://stackoverflow.com/questions/21089959/detecting-collision-of-rectangle-with-circle
 *
 * this shit broken bruh i need to get this fixed
*/
function collisionCircleAndRectangle(circle, rect, ctx) {
    rect.y -= rect.h; // bro idfk atp if it works it works
    var distX = Math.abs(circle.x - rect.x); // changed this and it worked so idk
    var distY = Math.abs(circle.y - rect.y); // changed this and it worked so idk
    if (distX > (rect.w / 2 + circle.r))
        return false;
    if (distY > (rect.h / 2 + circle.r))
        return false;
    if (distX <= (rect.w / 2))
        return true;
    if (distY <= (rect.h / 2))
        return true;
    var dx = distX - rect.w / 2;
    var dy = distY - rect.h / 2;
    return (dx * dx + dy * dy <= (circle.r * circle.r));
}
exports.collisionCircleAndRectangle = collisionCircleAndRectangle;
/** why not */
function collisionCircelAndCircle(ball1, ball2) {
    // if dist^2 < sum_r^2, then the circles are colliding
    return (ball2.x - ball1.x) ** 2 + (ball2.y - ball1.y) ** 2 < (ball1.r + ball2.r) ** 2;
}
exports.collisionCircelAndCircle = collisionCircelAndCircle;

},{}],8:[function(require,module,exports){
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

},{}]},{},[3]);
