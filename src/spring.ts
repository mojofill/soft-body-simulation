import Force from "./force";
import { PhysicsObject } from "./physicsObject";
import Vector from "./vector";

/** the equillibium */
export class Spring extends Force {
    /** `k` is the spring constant of this spring */
    
    public equilibrium: number; // this is the natural length of the spring, and it is given by the initial positions of the objects
    
    /** `b` is the spring constant, `c` is the damping constant */
    constructor(public obj1: PhysicsObject, public obj2: PhysicsObject, public k: number, public c: number, public ctx: CanvasRenderingContext2D) {
        super(0, 0); // spring force doesnt make sense to have direction or magnitude, as these are calculated

        this.equilibrium = Math.sqrt((obj2.cx - obj1.cx) ** 2 + (obj2.cy - obj1.cy) ** 2);
    }

    public render() {
        const height = this.ctx.canvas.height;
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(this.obj1.cx, height - this.obj1.cy);
        this.ctx.lineTo(this.obj2.cx, height - this.obj2.cy);
        this.ctx.stroke();
    }

    public get deltaX(): number {
        // the formula is: F_spring = k * delta_x
        // delta_x is the abs value difference of the equilibrium length and the distance between the two objects at this current frame

        // this is the obj dist at this current frame
        const objDist = Math.sqrt((this.obj2.cx - this.obj1.cx) ** 2 + (this.obj2.cy - this.obj1.cy) ** 2);
        
        return objDist - this.equilibrium;
    }

    /** applies spring physics to both `obj1` and `obj2` */
    public applySpringPhysics(dt: number) {
        // CASE I: obj1 is not anchored
        if (!this.obj1.anchored) {
            // get direction to the other object
            const directionVector = new Vector(this.obj2.cx - this.obj1.cx, this.obj2.cy - this.obj1.cy);
            // scale it down by the magnitude of force to get the spring force
            const springForce = new Force(this.k * this.deltaX, Math.atan2(directionVector.y, directionVector.x));

            // apply this spring force to obj1
            this.obj1.applyForce(springForce, dt);

            // now apply damping
            // referring to this video: https://youtu.be/kyQP4t_wOGI
            // first get the speed at which the spring is expanding

            // get the normalized direction vector between obj2 and obj1
            const normalizedDirectionVector = directionVector.normalized;

            // find the velocity difference (B - A)
            // i can probably make this cleaner with a method for subtracting but whatever
            const velocityDifference = new Vector(this.obj2.v.x - this.obj1.v.x, this.obj2.v.y - this.obj1.v.y);

            const dampingDirection = Vector.dotProduct(normalizedDirectionVector, velocityDifference);
            const theta = (dampingDirection < 0 ? Math.PI : 0) + normalizedDirectionVector.theta; // flip theta if damping direction is negative
            // abs value of damping direction because we need the magnitude
            const dampingForce = new Force(normalizedDirectionVector.multiply(Math.abs(dampingDirection) * this.c).magnitude, theta);

            this.obj1.applyForce(dampingForce, dt);
        }

        // CASE II: obj2 is not anchored
        // copied from CASE I for sake of development time (im just too lazy)
        // read comments for CASE I to understand this code
        if (!this.obj2.anchored) {
            // flippped obj1 and obj2 for the direction, everything else is the same as CASE I
            const directionVector = new Vector(this.obj1.cx - this.obj2.cx, this.obj1.cy - this.obj2.cy);
            const springForce = new Force(this.k * this.deltaX, Math.atan2(directionVector.y, directionVector.x));

            this.obj2.applyForce(springForce, dt);

            const normalizedDirectionVector = directionVector.normalized;

            const velocityDifference = new Vector(this.obj1.v.x - this.obj2.v.x, this.obj1.v.y - this.obj2.v.y);

            const dampingDirection = Vector.dotProduct(normalizedDirectionVector, velocityDifference);
            const theta = (dampingDirection < 0 ? Math.PI : 0) + normalizedDirectionVector.theta;
            const dampingForce = new Force(normalizedDirectionVector.multiply(Math.abs(dampingDirection) * this.c).magnitude, theta);

            this.obj2.applyForce(dampingForce, dt);
        }

        // CASE III: both are not anchored. wait this is actually already taken care of. all good i dont need to make anymore spaghetti code

        this.obj1.cx += this.obj1.v.x * dt;
        this.obj1.cy += this.obj1.v.y * dt;
        this.obj2.cx += this.obj2.v.x * dt;
        this.obj2.cy += this.obj2.v.y * dt;
    }
}