import { EditorView, basicSetup } from "https://esm.sh/codemirror@6.0.1";
import { insertTab } from "https://esm.sh/@codemirror/commands@6.5.0";
import { javascript } from "https://esm.sh/@codemirror/lang-javascript@6.2.2";
import { cpp } from "https://esm.sh/@codemirror/lang-cpp@6.0.2";
import { python } from "https://esm.sh/@codemirror/lang-python@6.0.2";
import { markdown } from "https://esm.sh/@codemirror/lang-markdown@6.0.2";
import { oneDark } from "https://esm.sh/@codemirror/theme-one-dark@6.1.2";

import * as set from '/script/library/settings.js';

var bright = set.SettingItem('display.brightness');

export function Main(param) {
    if (!param) param = ["cpp"];
    if (param.length == 0) 
        param.push("cpp");

    var link = "app.editor.code." + param[0];

    const parentElement = document.getElementById('main');

    if (!localStorage.getItem(link))
        localStorage.setItem(link, "");

    const editor = new EditorView({
        doc: localStorage.getItem(link),
        extensions: (bright === 'dark' ? [
            basicSetup,
              (param[0] === "javascript" ? javascript() 
            : (param[0] === "python" ? python() 
            : (param[0] === "markdown" ? markdown() 
            : cpp()))),
            oneDark
        ] : [
            basicSetup,
              (param[0] === "javascript" ? javascript() 
            : (param[0] === "python" ? python() 
            : (param[0] === "markdown" ? markdown() 
            : cpp())))
        ]),
        parent: parentElement,
    });

    setInterval(() => {
        var store = editor.state.doc;
        if (store.toString() !== store.toString().replaceAll("    ", "\t").replaceAll("  ", "\t")) {
            var a = editor.state.selection.main.from;
            editor.dispatch({
                changes: { 
                    from: 0, 
                    to: editor.state.doc.length, 
                    insert: editor.state.doc.toString().replaceAll("    ", "\t").replaceAll("  ", "\t") 
                }
            });
            editor.dispatch({
                selection: { anchor: a - 1 }
            });
        }
        localStorage.setItem(link, editor.state.doc.toString());
    }, 10);

    // --- 全局 Tab 键捕获逻辑 ---
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Tab') {
            if (editor.dom.contains(document.activeElement)) {
                event.preventDefault();
                insertTab(editor);
            }
        }
    }, true);

    editor.focus();
}