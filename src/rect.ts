import { PhysicsObject } from "./physicsObject";
import { drawRect } from "./utils";

export default class Rect extends PhysicsObject {
    /** pass in the center (x, y) position of the rectangle */
    constructor(
        public cx: number,
        public cy: number,
        public w: number,
        public h: number,
        public theta: number,
        public mass: number,
        public frictionCoefficient: number,
        public anchored: boolean,
        public color: string,
        public ctx: CanvasRenderingContext2D,
        public name: string = "DEFAULT NO NAME"
    ) {
        super(cx, cy, {w: w, h: h, r: null}, theta, mass, frictionCoefficient, anchored, name);
    }
    
    public render() {
        drawRect(this.cx, this.cy, this.w, this.h, this.theta, this.color, this.ctx);
    }
}