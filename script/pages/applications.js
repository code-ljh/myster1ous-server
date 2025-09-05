import * as cvs from '/script/library/canvas.js';
import * as set from '/script/library/settings.js';

var Color = {
    "dark": ["#d57d7dff", "#6fa6ddff", "#b68ac1aa", "#7ae393ff", "#c8c465ff"],
    "light": ["#860b0bff", "#205080ff", "#7f2695aa", "#1c8133ff", "#807c1fff"]
};

var br = set.SettingItem("display.brightness");
var ed = (br === "dark" ? "light" : "dark");

export function Application(p, applist) {
    var col = getComputedStyle(document.documentElement)
        .getPropertyValue("--color-text");

    var canvas = document.createElement("canvas");
    p.appendChild(canvas);
    canvas.classList.add("apl-canvas");
    // 100 Are valid;
        
    var ctx = canvas.getContext('2d');

    var mousex = -1, mousey = -1;
    var mousestate = 'up';

    canvas.addEventListener("mousemove", (evt) => {
        const rect = canvas.getBoundingClientRect();
        mousex = (evt.clientX - rect.left);
        mousey = (evt.clientY - rect.top);
    });

    canvas.addEventListener("mousedown", (evt) => {
        mousestate = 'down';
    });

    canvas.addEventListener("mouseup", (evt) => {
        mousestate = 'up';
    });

    function Animate() {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        var pos = [0, 0];

        for (var i of applist) {
            var IconText = i["id"][0];
            var hover = pos[0] + 20 <= mousex && mousex <= pos[0] + 80 && 
                pos[1] + 20 <= mousey && mousey <= pos[1] + 80;
        
            var col = (hover ? 
                Color[br][i["color"]] : Color[ed][i["color"]]
            );

            if (hover && mousestate === 'down') {
                window.location = `/applications/${i["id"]}`;
            }

            cvs.DrawRect(ctx, 
                pos[0] + 20, pos[1] + 20, 
                pos[0] + 80, pos[1] + 80, 
                col, 10, 20);
            
            cvs.DrawCenteredText(ctx,
                IconText,
                pos[0] + 50, pos[1] + 50,
                col, `bold 40px Consolas`
            );

            cvs.DrawCenteredText(ctx,
                i["name"],
                pos[0] + 50, pos[1] + 95,
                Color[br][i["color"]], `bold 10px Consolas`
            );
            
            pos[0] += 80;
            if (pos[0] + 80 > canvas.width)
                pos[0] = 0, pos[1] += 100;
        }

        requestAnimationFrame(Animate);
    }
    Animate();
}