import * as cvs from '/script/library/canvas.js';

const BASIC_COLOR = 
    getComputedStyle(document.documentElement)
    .getPropertyValue("--color-text");

export function Main() {
    var parent = document.getElementById("main");
    var par = document.createElement("div");
    var input = document.createElement("input");
    var ctrls = document.createElement("button");
    var cflx = document.createElement("div");
    var audio = new Audio('/asset/audio/countdown.mp3');
    parent.appendChild(par);
    parent.classList.add("cd-all");
    par.appendChild(input);
    par.appendChild(cflx);
    par.classList.add("cd-parent");
    cflx.appendChild(ctrls);
    input.classList.add("modern-input");
    input.type = "number";
    input.value = "10";
    ctrls.innerText = "开始";
    ctrls.classList.add("cd-button");

    var tst = 1e100;
    var starting = 10;

    setInterval(
        () => {
            var now = Date.now();
            if (now >= tst) {
                ctrls.innerText = "开始";
                input.value = starting;
                tst = 1e100;
                for (var i = 0; i < 3; i++)
                    audio.play();
            } else {
                if (ctrls.innerText === "中止") {
                    input.value = (tst - now) / 1000;
                }
            }
        }, 100
    );

    ctrls.onclick = () => {
        if (ctrls.innerText === "开始") {
            ctrls.innerText = "中止";
            starting = parseFloat(input.value);
            tst = Date.now() + 1000 * parseFloat(input.value);
        } else {
            ctrls.innerText = "开始";
        }
    };
}