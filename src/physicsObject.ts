import Force from "./force"
import { g, collisionCircleAndRectangle, collisionCircelAndCircle } from "./utils";
import Vector from "./vector";

export interface Dimension {
    w: number | null,
    h: number | null,
    r: number | null
}

export abstract class PhysicsObject {
    public forces: Force[] = [];

    // TODO: torque + rotation

    public v: Vector = new Vector(0, 0);

    public w: number | null = null;
    public h: number | null = null;
    public r: number | null = null;

    public gravityToggle: boolean = true;

    private save_x: number = 0; // saves position of object in previous frame
    private save_y: number = 0; // saves position of object in previous frame
    private save_v: Vector = new Vector();

    constructor(
        public cx: number,
        public cy: number,
        public dimension: Dimension,
        public theta: number,
        public mass: number,
        public frictionCoefficient: number,
        public anchored: boolean,
        public name: string = "DEFAULT NO NAME"
        ) {}

    public applyPhysics(objects: PhysicsObject[], dt: number, ctx: CanvasRenderingContext2D) {
        if (this.anchored) return; // if it is anchored, then no physics are to applied as all forces will cancel out

        this.forces = [];

        if (this.gravityToggle) this.forces.push(new Force(this.mass * g, -Math.PI / 2));

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

    public save() {
        this.save_x = this.cx;
        this.save_y = this.cy;
        this.save_v = this.v;
    }

    public restore() {
        this.cx = this.save_x;
        this.cy = this.save_y;
        this.v = this.save_v;
    }

    /** force will act on this object */
    public applyForce(force: Force, dt: number) {
        let vector = force.vector.copy();
        vector = vector.multiply(dt / this.mass);
        this.v = this.v.add(vector);
    }

    /** when object collides with another object, then internal forces will be applied 
     * 
     * returns `null` if the object has collided with nothing
     * return a `PhysicsObject[]` if the object HAS collided with something
    */
    public collisionDetect(objects: PhysicsObject[], ctx: CanvasRenderingContext2D) : PhysicsObject[] | null {
        let objectsCollidedWith: PhysicsObject[] = [];

        for (let i = 0; i < objects.length; i++) {
            const object = objects[i];

            if (object === this) continue; // cannot collide with itself
            
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
                if (this.r === null || (object.w === null || object.h === null)) throw new Error("how u this stupid bruh. this probably gonna be a very unhelpful error message.");
                if (collisionCircleAndRectangle({x: this.cx, y: this.cy, r: this.r}, {x: object.cx, y: object.cy, w: object.w, h: object.h}, ctx)) {
                    objectsCollidedWith.push(object);
                }
            }

            // this rect and object circle collision detect
            if (object.isCircle && this.isRect) {
                if ((this.w === null || this.h === null) || object.r === null) throw new Error("how u this stupid bruh. this probably gonna be a very unhelpful error message. this is the second one of its kind.");
                if (collisionCircleAndRectangle({x: object.cx, y: object.cy, r: object.r}, {x: this.cx, y: this.cy, w: this.w, h: this.h}, ctx)) {
                    objectsCollidedWith.push(object);
                }
            }
        }

        return objectsCollidedWith.length === 0 ? null : objectsCollidedWith;
    }

    public get isCircle() : boolean {
        return this.dimension.r !== null;
    }

    public get isRect() : boolean {
        return this.dimension.w !== null && this.dimension.h !== null;
    }

    public addForce(...forces: Force[]) {
        for (const force of forces) {
            this.forces.push(force);
        }
    }

    abstract render(): void;
}