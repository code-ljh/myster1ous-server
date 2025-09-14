import { EditorView, basicSetup } from "https://esm.sh/codemirror@6.0.1";
import { insertTab } from "https://esm.sh/@codemirror/commands@6.5.0";
import { javascript } from "https://esm.sh/@codemirror/lang-javascript@6.2.2";
import { cpp } from "https://esm.sh/@codemirror/lang-cpp@6.0.2";
import { python } from "https://esm.sh/@codemirror/lang-python@6.0.2";
import { markdown } from "https://esm.sh/@codemirror/lang-markdown@6.0.2";
import { oneDark } from "https://esm.sh/@codemirror/theme-one-dark@6.1.2";

import * as set from '/script/library/settings.js';
var bright = set.SettingItem('display.brightness');
function RealMain(IndexJS) {
    var parent = document.getElementById("main");

    parent.classList.add("home-main");
    parent.innerHTML = `
        <div class="home-leftpart">
        </div>

        <div class="home-rightpart">
            <div class="home-compare-card card">
                <h5> <a href="/luogu/compare">Comparer</a> </h5>
                <div class="home-compare">
                    <input class="modern-input" id="inputer" autocomplete="off">
                    <div class="articles-smalltag card hover-translate" id="go"> GO </div>
                </div>
            </div> 
            
            <div class="home-compare-card card">
                <h5> Problem </h5>
                <div class="home-compare">
                    <input class="modern-input" id="inputer2" autocomplete="off">
                    <div class="articles-smalltag card hover-translate" id="go2"> GO </div>
                </div>
            </div>
        </div>
    `;
    var inp = document.getElementById("inputer");  
    inp.value = "porse114514";
    var inp = document.getElementById("inputer2");  
    inp.value = "P1001";
    
    document.getElementById("go")
        .onclick = () => {
            var inp = document.getElementById("inputer");    
            window.location.href = "/luogu/compare/" + inp.value;
        };
    
    document.getElementById("go2")
        .onclick = () => {
            var inp = document.getElementById("inputer2");    
            window.location.href = "/luogu/problem/" + inp.value;
        };

    setInterval(() => {
        var inp = document.getElementById("inputer");    
        const regex = /[^a-zA-Z0-9_]/g;
        inp.value = inp.value.replace(regex, '');
    }, 10);

    setInterval(() => {
        var inp = document.getElementById("inputer2");    
        const regex = /[^a-zA-Z0-9_]/g;
        inp.value = inp.value.replace(regex, '');
    }, 10);
    
    var MAIN = document.getElementById("main");
    
    const editor = new EditorView({
        doc: IndexJS,
        extensions: (bright === 'dark' ? [
            basicSetup,
            javascript(),
            oneDark
        ] : [
            basicSetup,
            javascript()
        ]),
        parent: MAIN.children[0],
    });

    MAIN.children[0].classList.add("cm-editor-parent");
}

export function loadhome(param) {
    fetch('/api/source')
        .then(response => response.text())
        .then(text => {
            RealMain(text);
        });
}