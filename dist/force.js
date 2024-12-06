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
//# sourceMappingURL=force.js.map