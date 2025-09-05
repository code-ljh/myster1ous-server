export function DrawFilledCircle(ctx, x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
}

export function DrawCenteredText(ctx, text, x, y, color = 'black', font = '16px fira code') {
    ctx.save();
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x, y);
    ctx.restore();
}

export function DrawStrokedCircle(ctx, x, y, radius, color = 'black', lineWidth = 1) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
}

export function DrawCircle(ctx, x, y, radius, color = 'black', lineWidth = 1) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.fill();
}

export function DrawLine(ctx, x0, y0, x1, y1, color) {
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.strokeStyle = color;
    ctx.stroke();
}

export function DrawEdge(ctx, x0, y0, x1, y1, color, radius) {
    var dx = x0 - x1;
    var dy = y0 - y1;
    var d = Math.sqrt(dx * dx + dy * dy);
    var percent = radius / d;
    var kx = percent * dx;
    var ky = percent * dy;
    DrawLine(ctx, x0 - kx, y0 - ky, x1 + kx, y1 + ky, color);
}

// export function DrawRect(ctx, x0, y0, x1, y1, color, sickness) {
//     ctx.beginPath();
//     ctx.strokeStyle = color;
//     ctx.lineWidth = sickness;
//     ctx.moveTo(x0, y0);
//     ctx.lineTo(x1, y0);
//     ctx.lineTo(x1, y1);
//     ctx.lineTo(x0, y1);
//     ctx.lineTo(x0, y0);
//     ctx.closePath();
//     ctx.stroke();
// }

export function DrawRect(ctx, x0, y0, x1, y1, color, lineWidth, borderRadius = 0) {
    const width = x1 - x0;
    const height = y1 - y0;
    
    // 限制圆角半径不超过矩形尺寸的一半
    const maxRadius = Math.min(width, height) / 2;
    const radius = Math.min(borderRadius, maxRadius);
    
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    
    // 绘制带圆角的矩形路径
    if (radius > 0) {
        // 左上角
        ctx.moveTo(x0 + radius, y0);
        ctx.arcTo(x1, y0, x1, y1, radius);
        // 右上角
        ctx.arcTo(x1, y1, x0, y1, radius);
        // 右下角
        ctx.arcTo(x0, y1, x0, y0, radius);
        // 左下角
        ctx.arcTo(x0, y0, x1, y0, radius);
    } else {
        // 没有圆角的普通矩形
        ctx.rect(x0, y0, width, height);
    }
    
    ctx.closePath();
    ctx.stroke();
}