import { PhysicsObject } from "./physicsObject";
import { drawBall } from "./utils";

export default class Ball extends PhysicsObject{
    constructor(public cx: number,
        public cy: number,
        public r: number,
        public theta: number, // useless for a ball, but it dont matter anyway
        public mass: number,
        public frictionCoefficient: number,
        public anchored: boolean,
        public color: string,
        public ctx: CanvasRenderingContext2D,
        public name: string = "DEFAULT NO NAME")
    {
        super(cx, cy, {w: null, h: null, r: r}, theta, mass, frictionCoefficient, anchored, name);
    }

    public render() {
        drawBall(this.cx, this.cy, this.r, this.color, this.ctx);
    }
}