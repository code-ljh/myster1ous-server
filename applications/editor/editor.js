import * as txt from '/script/library/text.js';
import * as set from '/script/library/settings.js';

import { EditorView, basicSetup } from "https://esm.sh/codemirror@6.0.1";
import { insertTab } from "https://esm.sh/@codemirror/commands@6.5.0";
import { javascript } from "https://esm.sh/@codemirror/lang-javascript@6.2.2";
import { cpp } from "https://esm.sh/@codemirror/lang-cpp@6.0.2";
import { python } from "https://esm.sh/@codemirror/lang-python@6.0.2";
import { markdown } from "https://esm.sh/@codemirror/lang-markdown@6.0.2";
import { oneDark } from "https://esm.sh/@codemirror/theme-one-dark@6.1.2";

var body = document.body;
var link = document.createElement("link");
link.rel = "stylesheet";
link.src = "/applications/editor/editor.css";

function EndUP() {
    var s = document.getElementsByClassName("cm-editor");
    for (var i of s) {
        var p = i.parentNode;
        p.classList.add("cm-editor-parent");
    }
}

export function Main() {
    const link = "app.katexeditor.document";

    var parent = document.getElementById("main");
    var leftbar = document.createElement("div");
    var rightbar = document.createElement("div");
    var text = document.createElement("div");
    // var textcode = document.createElement("code");
    var show = document.createElement("div");
    parent.appendChild(leftbar);
    parent.appendChild(rightbar);
    parent.classList.add("editor-main");
    leftbar.appendChild(text);
    leftbar.classList.add("editor-leftbar");
    rightbar.appendChild(show);
    rightbar.classList.add("editor-rightbar");
    // text.classList.add("editor-textarea");
    text.style.overflowY = "auto";
    // text.appendChild(textcode);
    show.classList.add("editor-showarea");
    show.classList.add("markdown-card");

    const editor = new EditorView({
        doc: localStorage.getItem(link),
        extensions: [
            basicSetup,
            markdown(),
            oneDark
        ],
        parent: text,
    });

    if (!localStorage.getItem(link)) {
        null;
    } else {
        editor.dispatch({
            changes: { 
                from: 0, 
                to: editor.state.doc.length, 
                insert: localStorage.getItem(link) 
            }
        });
    }

    // editor.classList.add("editor-textarea");

    var store = "";
    setTimeout(
        () => {
            setInterval(() => {
                var textvalue = editor.state.doc.toString();
                if (store !== textvalue) {
                    txt.Text(textvalue, show);
                    localStorage.setItem(link, textvalue);
                    store = textvalue;
                }                
            }, 800);
        }, 800
    );  

    window.addEventListener('keydown', (event) => {
        if (event.key === 'Tab') {
            if (editor.dom.contains(document.activeElement)) {
                event.preventDefault();
                // 使用正确的命令来插入一个字面的 Tab 字符
                insertTab(editor);
            }
        }
    }, true);

    EndUP();
}

export function UsedMain(link, data) {
    var parent = document.getElementById("main");
    var leftbar = document.createElement("div");
    var rightbar = document.createElement("div");
    var text = document.createElement("div");
    // var textcode = document.createElement("code");
    var show = document.createElement("div");
    parent.appendChild(leftbar);
    parent.appendChild(rightbar);
    parent.classList.add("editor-main");
    leftbar.appendChild(text);
    leftbar.classList.add("editor-leftbar");
    rightbar.appendChild(show);
    rightbar.classList.add("editor-rightbar");
    // text.classList.add("editor-textarea");
    text.style.overflowY = "auto";
    // text.appendChild(textcode);
    show.classList.add("editor-showarea");
    show.classList.add("markdown-card");

    const editor = new EditorView({
        doc: data,
        extensions: [
            basicSetup,
            markdown(),
            oneDark
        ],
        parent: text,
    });

    if (!localStorage.getItem(link)) {
        null;
    } else {
        editor.dispatch({
            changes: { 
                from: 0, 
                to: editor.state.doc.length, 
                insert: localStorage.getItem(link) 
            }
        });
    }

    var store = "";
    setTimeout(
        () => {
            setInterval(() => {
                var textvalue = editor.state.doc.toString();
                if (store !== textvalue) {
                    txt.Text(textvalue, show);
                    localStorage.setItem(link, textvalue);
                    store = textvalue;
                }                
            }, 800);
        }, 800
    );  

    window.addEventListener('keydown', (event) => {
        if (event.key === 'Tab') {
            if (editor.dom.contains(document.activeElement)) {
                event.preventDefault();
                // 使用正确的命令来插入一个字面的 Tab 字符
                insertTab(editor);
            }
        }
    }, true);

    EndUP();

    return editor;
}