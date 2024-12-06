import Vector from "./vector";

export default class Force {
    public vector: Vector = new Vector();
    
    /** theta in degrees cuz thats shorter to write in */
    public constructor(magnitude: number, theta: number) {
        this.vector.x = magnitude * Math.cos(theta);
        this.vector.y = magnitude * Math.sin(theta);
    }
    
    public get magnitude() {
        return this.vector.magnitude;
    }
}