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
//# sourceMappingURL=utils.js.map