import * as text from "/script/library/text.js";
import * as cvs from "/script/library/canvas.js";

const BASIC_COLOR = 
    getComputedStyle(document.documentElement)
    .getPropertyValue("--color-text");

const BASE_COLOR = 
    getComputedStyle(document.documentElement)
    .getPropertyValue("--color-body");

function TextWidth(txt) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = 'Consolas';
    console.log(txt, typeof(txt));
    const metrics = context.measureText(txt);
    console.log(metrics.width);
    return metrics.width / fs;
}

function DrawArrow(ctx, xpos, ypos, xto, yto, radius) {
    cvs.DrawEdge(ctx, xpos, ypos, xto, yto, BASIC_COLOR, radius);
    var dx = xpos - xto;
    var dy = ypos - yto;
    var d = Math.sqrt(dx * dx + dy * dy);
    var percent = radius / d;
    var kx = xto + percent * dx;
    var ky = yto + percent * dy;
    xto = kx, yto = ky;
    dx = xto - xpos;
    dy = yto - ypos;
    let length = Math.sqrt(dx * dx + dy * dy);
    let unitX = dx / length;
    let unitY = dy / length;
    let arrowTipX = xto - unitX * radius;
    let arrowTipY = yto - unitY * radius;
    let perpX = -unitY;
    let perpY = unitX;
    let triangleHeight = radius * Math.sqrt(3) / 2;
    let halfBase = radius / 2;
    let basePoint1X = arrowTipX - unitX * triangleHeight + perpX * halfBase;
    let basePoint1Y = arrowTipY - unitY * triangleHeight + perpY * halfBase;
    let basePoint2X = arrowTipX - unitX * triangleHeight - perpX * halfBase;
    let basePoint2Y = arrowTipY - unitY * triangleHeight - perpY * halfBase;
    ctx.beginPath();
    ctx.moveTo(xto, yto);
    ctx.lineTo(basePoint1X, basePoint1Y);
    ctx.lineTo(basePoint2X, basePoint2Y);
    ctx.closePath();
    ctx.fillStyle = BASIC_COLOR;
    ctx.fill();
}

var fs = 12;
var outline = 3;

class Nodes {
    constructor(xpos, ypos, mass, size, name) {
        this.x = xpos;
        this.y = ypos;
        this.vx = 0;
        this.vy = 0;
        this.ax = 0;
        this.ay = 0;
        this.radius = size;
        this.depth = -1;
        this.name = name;
        this.mass = mass;
    }

    __draw(ctx, text, X, Y, color) {
        var lfs = fs / 8 * 3;
        if (this.name >= 2.5) {
            const textWidth = this.name * lfs * 1.7; 
            const nodeCenterY = Y(this.y);
            var x0 = X(this.x) - textWidth - this.radius / 2;
            var y0 = nodeCenterY - fs / 2 - this.radius / 2;
            var x1 = X(this.x) + textWidth + this.radius / 2;
            var y1 = nodeCenterY + fs / 2 + this.radius / 2;
            cvs.DrawRect(ctx, x0, y0, x1, y1, color, outline, fs / 2);
        } else {
            cvs.DrawStrokedCircle(ctx, X(this.x), Y(this.y), this.radius + (fs - 13 + this.name * 5), color, outline);
        }

        cvs.DrawCenteredText(
            ctx, text, X(this.x), Y(this.y),
            color, `bold ${fs}px consolas`
        );
    }

    Draw(ctx, text, X, Y) {
        this.__draw(ctx, text, X, Y, BASIC_COLOR);
    }

    DrawDragged(ctx, text, X, Y) {
        this.__draw(ctx, text, X, Y, "#82440eaa");
    }

    DrawBinded(ctx, text, X, Y) {
        this.__draw(ctx, text, X, Y, "#0e6182aa");
    }

    UpdateByNewton() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx += this.ax;
        this.vy += this.ay;
    }
}

var ELECTRICAL_STRENGTH = 1500;
var LAYER_STRENGTH = 4;
var GRAVITY_STRENGTH = 0.3;
var EDGE_IDEAL_LENGTH = 15;
var POHIGER_STRENGTH = 2.5;
var CENTER_IDEAL_LENGTH = 0;
var FRACTION_FORCE = 0.95;
var SINGULAR_FRACTION = 0.89;
var HEAT_STRENGTH = 0.05;
var MAX_VELOCITY = 2;
var MAX_ACCELERATE = 2;
var LAYER_HEIGHT = 10;

var tet = `
### 图例
- \`u v\` 添加一条 $u \\to v$ 的边
- \`u\` 锁定 $u$ 的位置
- \`/tree-mode\` 进入树形模式
- 普通点击拖拽节点。
- Ctrl 点击固定节点
- 默认根节点为字典序最小节点
- 节点白色表示正常节点
- 节点橙色表示正在拖拽
- 节点蓝色表示锁定位置
- 详见 [使用说明。](/articles/graph-editor)
`;

export function Main() {
    var miin = document.getElementById("miin");
    text.Text(tet, miin);
    miin.classList.add("ge-smallmiin");

    var graph = [];
    var bind = new Set();
    var nodes = {};

    var parent = document.getElementById("main");
    var leftpart = document.createElement("div");
    var rightpart = document.createElement("div");
    var leftxt = document.createElement("textarea");
    var canvas = document.createElement("canvas");
    parent.appendChild(leftpart);
    parent.appendChild(rightpart);
    parent.classList.add("ge-main");
    leftpart.classList.add("ge-leftbar");
    leftpart.appendChild(leftxt);
    rightpart.classList.add("ge-rightbar");
    rightpart.appendChild(canvas);
    leftxt.classList.add("ge-textarea");
    canvas.classList.add("ge-canvas");

    var ctx = canvas.getContext("2d");

    function X(x) { return canvas.width * x / 100.0 + canvas.width / 2; }
    function Y(y) { return canvas.height * y / 100.0 + canvas.height / 2; }
    function X_X(x) { return x * 100.0 / canvas.width - 50; }
    function Y_Y(y) { return y * 100.0 / canvas.height - 50; }

    function XLen(x) { return X(x) - X(0); }
    function YLen(y) { return Y(y) - Y(0); }

    const radius = XLen(3);

    function AddNode(text) {
        nodes[text] = new Nodes(
            Math.random() * 100 - 50,
            Math.random() * 100 - 50,
            100, radius, TextWidth(text)
        );
    }

    var MapNodeval = {};
    leftxt.value = `/tree-mode\n1 2\n2 3\n3 4\n3 5\n3 6\n6 7\n6 8`;
    var root = [];
    leftxt.onchange = () => {
        var list = leftxt.value.split("\n");
        graph = [];
        bind = new Set();
        TreeMode = false;
        DirectedMode = false;
        root = [];
        fs = 12;
        outline = 3;
        for (var i of list) {
            if (i == "/tree-mode") {
                TreeMode = true;
            } else if (i == "/directed") {
                DirectedMode = true;
            } else {
                while (i.length && i[i.length - 1] === ' ')
                    i = i.slice(0, i.length - 1);
                if (i.split(" ").length === 2) {
                    if (i.split(" ")[0] === "/root") {
                        root.push(i.split(" ")[1]);
                    } else if (i.split(" ")[0] === '/font-size') {
                        try {
                            fs = parseInt(i.split(" ")[1]);
                            if (isNaN(fs))
                                fs  = 3;
                        } catch {
                            fs = 12;
                        }
                    } else if (i.split(" ")[0] === '/outline') {
                        try {
                            outline = parseInt(i.split(" ")[1]);
                            if (isNaN(outline))
                                outline = 3;
                        } catch {
                            outline = 3;
                        }
                    } else
                        graph.push([i.split(" ")[0], i.split(" ")[1]]);
                } else if (i.split(" ").length === 3) {
                    if (i.split(" ")[0] === "$nv") {
                        MapNodeval[
                            i.split(" ")[1]] = i.split(" ")[2];
                        console.log(MapNodeval);
                    } else {
                        graph.push(i.split(" "));
                    }
                } else if (i.split(" ").length == 1) {
                    if (nodes[i])
                        bind.add(i);
                }
            }
        }

        for (var i of graph) {
            if (!nodes[i[0]]) AddNode(i[0]);
            if (!nodes[i[1]]) AddNode(i[1]);
        }
    };
    leftxt.onchange();

    function FormatData() {
        leftxt.value = "";
        if (TreeMode) {
            leftxt.value += "/tree-mode\n";
        }
        if (DirectedMode) {
            leftxt.value += "/directed\n";
        }
        for (var i of root) {
            leftxt.value += "/root " + i + "\n";
        }
        if (fs != 12) {
            leftxt.value += "/font-size " + fs + "\n";
        } 
        if (outline != 3) {
            leftxt.value += "/outline " + outline + "\n";
        }
        for (var i of bind) {
            leftxt.value += i + "\n";
        }
        for (var i of graph) {
            leftxt.value += i.join(" ") + "\n";
        }
        leftxt.onchange();
    }

    var dragging = null;
    canvas.addEventListener('mousedown', event => {
        if (dragging) {
            dragging = null;
        } else {
            const rect = canvas.getBoundingClientRect();
            const x = X_X(event.clientX - rect.left);
            const y = Y_Y(event.clientY - rect.top);

            var closet = -1, closedist = 100000000;
            var nodelist = Object.keys(nodes);
            for (var i of nodelist) {
                var dx = nodes[i].x - x;
                var dy = nodes[i].y - y;
                var d = dx * dx + dy * dy;
                if (d < closedist) {
                    closedist = d;
                    closet = i;
                }
            }

            if (nodes[closet] && closedist <= nodes[closet].radius) {
                if (event.ctrlKey) {
                    if (bind.has(closet)) {
                        bind.delete(closet);
                        FormatData();
                    } else {
                        if (nodes[closet])
                            bind.add(closet);
                        FormatData();
                    }
                } else {
                    dragging = closet;
                }
            }
        }
    });

    var mousex = -1, mousey = -1;
    canvas.addEventListener('mousemove', event => {
        const rect = canvas.getBoundingClientRect();
        const x = X_X(event.clientX - rect.left);
        const y = Y_Y(event.clientY - rect.top);
        mousex = x, mousey = y;
    });

    var maxDepth;
    function BuildTree(x) {
        maxDepth = Math.max(maxDepth, nodes[x].depth);
        for (var i of graph) {
            if (i[0] === x || i[1] === x) {
                if (nodes[i[0]].depth == -1) {
                    nodes[i[0]].depth = nodes[x].depth + 1;
                    BuildTree(i[0]);
                } else if (nodes[i[1]].depth == -1) {
                    nodes[i[1]].depth = nodes[x].depth + 1;
                    BuildTree(i[1]);
                }
            }
        }
    }

    var TreeMode = true;
    var DirectedMode = false;

    function Animate() {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;

        if (dragging) {
            if (!nodes[dragging]) {
                dragging = null;
            } else {
                nodes[dragging].x = mousex;
                nodes[dragging].y = mousey;
            }
        }

        var set = new Set();

        for (var i of graph) {
            if (!nodes[i[0]]) AddNode(i[0]);
            if (!nodes[i[1]]) AddNode(i[1]);
            set.add(i[0]), set.add(i[1]);
        }

        for (var i in nodes)
            if (!set.has(i)) {
                delete nodes[i];
            }

        var nodelist = Object.keys(nodes);

        for (var i of nodelist)
            nodes[i].depth = -1;

        maxDepth = 1;
        for (var i of root) {
            nodes[i].depth = 1;
            BuildTree(i);
        }

        for (var i of nodelist) {
            if (nodes[i].depth == -1) {
                nodes[i].depth = 1;
                BuildTree(i);
            }
        }

        for (let i = 0; i < nodelist.length; i++) {
            const node = nodes[nodelist[i]];
            node.ax = 0;
            node.ay = 0;
        }

        const height = Math.min(LAYER_HEIGHT, 100 / maxDepth);
        if (TreeMode) {
            for (let i = 0; i < nodelist.length; i++) {
                const node = nodelist[i];
                const ideal = height * nodes[node].depth - 50 - height / 2
                    + (100 - height * maxDepth) / 2;
                const force = LAYER_STRENGTH * (nodes[node].y - ideal);
                nodes[node].ay -= force / nodes[node].mass;
            }
        }


        for (var i = 0; i < nodelist.length; i++)
            for (var j = i + 1; j < nodelist.length; j++) {
                var A = nodelist[i];
                var B = nodelist[j];

                var dx = nodes[A].x - nodes[B].x;
                var dy = nodes[A].y - nodes[B].y;
                var d = dx * dx + dy * dy;

                if (d <= 1e-12) continue;
                if (d <= 10) d = 10;

                var force = ELECTRICAL_STRENGTH / d;
                var fx = force * (dx / Math.sqrt(d));
                var fy = force * (dy / Math.sqrt(d));

                nodes[A].ax += fx / nodes[A].mass;
                nodes[A].ay += fy / nodes[A].mass;

                nodes[B].ax -= fx / nodes[B].mass;
                nodes[B].ay -= fy / nodes[B].mass;
            }

        for (var i = 0; i < nodelist.length; i++) {
            var A = nodelist[i];

            var d = nodes[A].x * nodes[A].x + nodes[A].y * nodes[A].y;

            if (d <= 1e-12) continue;
            if (d <= 10) d = 10;

            var force = GRAVITY_STRENGTH * (Math.sqrt(d) - CENTER_IDEAL_LENGTH);
            var fx = force * (nodes[A].x / Math.sqrt(d));
            var fy = force * (nodes[A].y / Math.sqrt(d));

            if (!TreeMode) {
                nodes[A].ax -= fx / nodes[A].mass;
                nodes[A].ay -= fy / nodes[A].mass;
            } else {
                nodes[A].ax -= fx / nodes[A].mass;
            }
        }

        for (var i = 0; i < graph.length; i++) {
            var x = graph[i][0];
            var y = graph[i][1];

            var dx = nodes[x].x - nodes[y].x;
            var dy = nodes[x].y - nodes[y].y;
            var d = dx * dx + dy * dy;

            if (d <= 1e-12) continue;
            if (d <= 10) d = 10;

            var force = POHIGER_STRENGTH * (Math.sqrt(d) - EDGE_IDEAL_LENGTH);
            var fx = force * (dx / Math.sqrt(d));
            var fy = force * (dy / Math.sqrt(d));

            if (!TreeMode) {
                nodes[x].ax -= fx / nodes[x].mass;
                nodes[x].ay -= fy / nodes[x].mass;

                nodes[y].ax += fx / nodes[y].mass;
                nodes[y].ay += fy / nodes[y].mass;
            } else {
                var force = POHIGER_STRENGTH * (Math.sqrt(d) - height);
                var fx = force * (dx / Math.sqrt(d));
                nodes[x].ax -= fx / nodes[x].mass;
                nodes[y].ax += fx / nodes[y].mass;
            }


            if (DirectedMode) {
                DrawArrow(ctx, 
                    X(nodes[x].x), Y(nodes[x].y), 
                    X(nodes[y].x), Y(nodes[y].y),
                    radius
                )
            } else
                cvs.DrawEdge(ctx,
                    X(nodes[x].x), Y(nodes[x].y),
                    X(nodes[y].x), Y(nodes[y].y),
                    BASIC_COLOR, radius
                )

            nodes[y].vx *= FRACTION_FORCE;
            nodes[y].vy *= FRACTION_FORCE;
            nodes[x].vx *= FRACTION_FORCE;
            nodes[x].vy *= FRACTION_FORCE;

            if (graph[i].length > 2) {
                var xx = (nodes[x].x + nodes[y].x) / 2;
                var yy = (nodes[x].y + nodes[y].y) / 2;
                cvs.DrawCircle(
                    ctx, X(xx), Y(yy), 
                    fs * 0.50, BASE_COLOR
                );
                
                cvs.DrawCenteredText(
                    ctx, graph[i][2], 
                    X(xx), Y(yy), 
                    BASIC_COLOR, `${fs * 0.66}px bold Consolas`
                );
            }
        }

        for (var i = 0; i < nodelist.length; i++)
            for (var j = i + 1; j < nodelist.length; j++)
                nodes[nodelist[i]].vx *= SINGULAR_FRACTION,
                    nodes[nodelist[i]].vy *= SINGULAR_FRACTION;

        for (var i = 0; i < nodelist.length; i++) {
            if (bind.has(nodelist[i]))
                continue;

            if (nodes[nodelist[i]].x < -50 || nodes[nodelist[i]].x > 50)
                nodes[nodelist[i]].vx *= -1, nodes[nodelist[i]].ax *= -1;
            if (nodes[nodelist[i]].y < -50 || nodes[nodelist[i]].y > 50)
                nodes[nodelist[i]].vy *= -1, nodes[nodelist[i]].ay *= -1;

            if (nodes[nodelist[i]].vx >= MAX_VELOCITY) nodes[nodelist[i]].vx = MAX_VELOCITY;
            if (nodes[nodelist[i]].vy >= MAX_VELOCITY) nodes[nodelist[i]].vy = MAX_VELOCITY;

            if (nodes[nodelist[i]].ax >= MAX_ACCELERATE) nodes[nodelist[i]].ax = MAX_ACCELERATE;
            if (nodes[nodelist[i]].ay >= MAX_ACCELERATE) nodes[nodelist[i]].ay = MAX_ACCELERATE;

            nodes[nodelist[i]].UpdateByNewton();
            nodes[nodelist[i]].vx += Math.random() * HEAT_STRENGTH - HEAT_STRENGTH / 2;
            nodes[nodelist[i]].vy += Math.random() * HEAT_STRENGTH - HEAT_STRENGTH / 2;
        }

        for (var i = 0; i < nodelist.length; i++) {
            nodes[nodelist[i]].Draw(ctx, nodelist[i], X, Y);
            if (dragging === nodelist[i]) {
                nodes[nodelist[i]].DrawDragged(ctx, nodelist[i], X, Y);
            } else if (bind.has(nodelist[i])) {
                nodes[nodelist[i]].DrawBinded(ctx, nodelist[i], X, Y);
            }

            if (MapNodeval[nodelist[i]]) {
                var nod = nodes[nodelist[i]];
                cvs.DrawRect(ctx, 
                    X(nod.x) - fs / 3 - fs * 0.5 * TextWidth(MapNodeval[nodelist[i]]), Y(nod.y) + radius * 2 - fs / 1.75,
                    X(nod.x) + fs / 3  + fs * 0.5 * TextWidth(MapNodeval[nodelist[i]]), Y(nod.y) + radius * 2 + fs / 1.75,
                    BASIC_COLOR, outline / 2, 2
                );
                cvs.DrawCenteredText(ctx, 
                    MapNodeval[nodelist[i]], 
                    X(nod.x), Y(nod.y) + radius * 2,
                    BASIC_COLOR, `${fs / 1.5}px bold Consolas`
                );
            }
        }

        requestAnimationFrame(Animate);
    } Animate();
}