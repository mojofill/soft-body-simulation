export const g: number = 50;

export function drawCircle(x: number, y: number, r: number, color: string, ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(x, ctx.canvas.height - y, r, 0, 2 * Math.PI);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.stroke();
    ctx.fill();
}

export function drawRect(cx: number, cy: number, w: number, h: number, theta: number, color: string, ctx: CanvasRenderingContext2D) {
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

export function drawBall(cx: number, cy: number, r: number, color: string, ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(cx, ctx.canvas.height - cy, r, 0, 2 * Math.PI, false);
    ctx.fillStyle = color;
    ctx.fill();
}

export interface Circle {
    x: number,
    y: number,
    r: number
};

export interface Rectangle {
    x: number,
    y: number,
    w: number,
    h: number
}

/** this one gonna be tough! (i think)
 * 
 * too much math and thinking, so i just copy this guy's work
 * 
 * https://stackoverflow.com/questions/21089959/detecting-collision-of-rectangle-with-circle
 * 
 * this shit broken bruh i need to get this fixed
*/
export function collisionCircleAndRectangle(circle: Circle, rect: Rectangle, ctx: CanvasRenderingContext2D) {    
    rect.y -= rect.h; // bro idfk atp if it works it works

    var distX = Math.abs(circle.x - rect.x); // changed this and it worked so idk
    var distY = Math.abs(circle.y - rect.y); // changed this and it worked so idk

    if (distX > (rect.w / 2 + circle.r)) return false;
    if (distY > (rect.h / 2 + circle.r)) return false;

    if (distX <= (rect.w / 2)) return true;
    if (distY <= (rect.h / 2)) return true;

    var dx = distX - rect.w / 2;
    var dy = distY - rect.h / 2;
    return (dx * dx + dy * dy <= (circle.r * circle.r));
}

/** why not */
export function collisionCircelAndCircle(ball1: Circle, ball2: Circle) {
    // if dist^2 < sum_r^2, then the circles are colliding
    return (ball2.x - ball1.x) ** 2 + (ball2.y - ball1.y) ** 2 < (ball1.r + ball2.r) ** 2;
}
