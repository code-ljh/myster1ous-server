import * as set from '/script/library/settings.js';

import { EditorView, basicSetup } from "https://esm.sh/codemirror@6.0.1";
import { insertTab } from "https://esm.sh/@codemirror/commands@6.5.0";
import { javascript } from "https://esm.sh/@codemirror/lang-javascript@6.2.2";
import { cpp } from "https://esm.sh/@codemirror/lang-cpp@6.0.2";
import { python } from "https://esm.sh/@codemirror/lang-python@6.0.2";
import { markdown } from "https://esm.sh/@codemirror/lang-markdown@6.0.2";
import { oneDark } from "https://esm.sh/@codemirror/theme-one-dark@6.1.2";

var dm = set.SettingItem("display.brightness");
var bright = set.SettingItem("display.brightness");

export function Text(txt, maincard) {
    maincard.classList.add("markdown-card");
    fetch('/api/render', {
            method: 'POST',
            headers: {
                'Content-Type': "text/plain"
            },
            body: txt
        }).then(response => response.text())
            .then(text => {
                maincard.innerHTML = text;

                var code = document.getElementsByTagName("code");
                var lis = [];

                for (var element of code) {
                    var newele = document.createElement("code");
                    var flag = element.classList.contains("language-cpp");
                    var flag2 = element.classList.contains("language-c");
                    newele.innerHTML = element.innerHTML;
                    if (flag) 
                        newele.classList.add("cplusplus");
                    if (flag2)
                        newele.classList.add("ccc");
                    element.replaceWith(newele);
                }

                while (true) {
                    var e = document.getElementsByClassName("cplusplus");
                    var t = e[0];
                    
                    if (!e.length) break;

                    var code = t.innerText;
                    var div = document.createElement("div");

                    t.parentNode.replaceWith(div);

                    div.innerHTML += `
                        <div class="card code-cpp-head">
                            <h4> Code-C++ </h4>
                            <div class="card articles-smalltag code-cpp-headbtn hover-translate">
                                <img src="/asset/${set.SettingItem('display.brightness')}/images-svg/${set.SettingItem('markdown.codeblock.default') === 'open' ? 'article' : 'categories'}.svg"></img>
                            </div>
                        </div>

                        <div>
                        </div>
                    `;

                    var editor = new EditorView({
                        doc: code,
                        extensions: (bright === 'dark' ? [
                            basicSetup,
                            cpp(),
                            oneDark
                        ] : [
                            basicSetup,
                            cpp()
                        ]),
                        parent: div.children[1]
                    });

                    if (set.SettingItem('markdown.codeblock.default') !== 'open') {
                        div.children[1].style.display = "none";
                    }

                    div.children[0].children[1].onclick = (tar) => {
                        var t = tar.currentTarget;
                        var e = t.parentNode.parentNode.children[1].style.display;
                        if (e === 'block') {
                            t.innerHTML = `<img src="/asset/${set.SettingItem('display.brightness')}/images-svg/categories.svg"></img>`;
                            t.parentNode.parentNode.children[1].style.display = 'none';
                        } else {
                            t.innerHTML = `<img src="/asset/${set.SettingItem('display.brightness')}/images-svg/article.svg"></img>`;
                            t.parentNode.parentNode.children[1].style.display = 'block';
                        }
                    };
                }
                
                while (true) {
                    var e = document.getElementsByClassName("ccc");
                    var t = e[0];
                    
                    if (!e.length) break;

                    var code = t.innerText;
                    var div = document.createElement("div");
                    console.log(code);

                    t.parentNode.replaceWith(div);

                    var editor = new EditorView({
                        doc: code,
                        extensions: [
                            basicSetup,
                            cpp(),
                            oneDark,
                            EditorView.editable.of(false)
                        ],
                        parent: div
                    });
                }

                var kkk = document.getElementsByTagName("table");
                for (var i of kkk) {
                    i.classList.add("modern-table");
                }
            });

    
    // var span = document.getElementsByTagName("span");

    // var Replace = [];
    // for (var i of span) {
    //     if (i.parentNode.tagName === "CODE" && i.parentNode.parentNode.tagName === "PRE") {
    //         var para = document.createElement("p");
    //         para.innerHTML = i.innerText;
    //         Replace.push([i.parentNode.parentNode, para]);
    //     }
    // }

    // var E = [];
    // for (var i of Replace) {
    //     i[0].replaceWith(i[1]);
    //     E.push(i[0]);
    // }
}
