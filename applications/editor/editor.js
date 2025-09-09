import * as txt from '/script/library/text.js';
import * as set from '/script/library/settings.js';

export function Main() {
    const link = "app.katexeditor.document";

    var parent = document.getElementById("main");
    var leftbar = document.createElement("div");
    var rightbar = document.createElement("div");
    var text = document.createElement("textarea");
    var textcode = document.createElement("code");
    var show = document.createElement("div");
    parent.appendChild(leftbar);
    parent.appendChild(rightbar);
    parent.classList.add("editor-main");
    leftbar.appendChild(text);
    leftbar.classList.add("editor-leftbar");
    rightbar.appendChild(show);
    rightbar.classList.add("editor-rightbar");
    text.classList.add("editor-textarea");
    text.appendChild(textcode);
    show.classList.add("editor-showarea");
    show.classList.add("markdown-card");

    if (!localStorage.getItem(link)) {
        text.value = "";
    } else {
        text.value = localStorage.getItem(link);
    }

    var store = "";
    setTimeout(
        () => {
            setInterval(() => {
                if (store !== text.value) {
                    txt.Text(text.value, show);
                    localStorage.setItem(link, text.value);
                    store = text.value;
                }                
            }, 800);
        }, 800
    );  
}

export function UsedMain(link) {
    var parent = document.getElementById("main");
    var leftbar = document.createElement("div");
    var rightbar = document.createElement("div");
    var text = document.createElement("textarea");
    var show = document.createElement("div");
    parent.appendChild(leftbar);
    parent.appendChild(rightbar);
    parent.classList.add("editor-main");
    leftbar.appendChild(text);
    leftbar.classList.add("editor-leftbar");
    rightbar.appendChild(show);
    rightbar.classList.add("editor-rightbar");
    text.classList.add("editor-textarea");
    show.classList.add("editor-showarea");
    show.classList.add("markdown-card");
    text.wrap = "off";

    if (!localStorage.getItem(link)) {
        text.value = "";
    } else {
        text.value = localStorage.getItem(link);
    }

    var store = "";
    setTimeout(
        () => {
            setInterval(() => {
                if (store !== text.value) {
                    txt.Text(text.value, show);
                    localStorage.setItem(link, text.value);
                    store = text.value;
                }                
            }, 800);
        }, 800
    );  
}