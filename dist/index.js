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
//# sourceMappingURL=index.js.map