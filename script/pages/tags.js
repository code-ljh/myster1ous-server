import * as tags from '/script/library/tags.js';
import * as showcard from '/script/library/showcard.js';
import * as set from '/script/library/settings.js';

function FindCount(tag, data) {
    var cnt = 0;
    for (var i of data) 
        if (i["tags"].includes(tag)) 
            cnt += 1;
    return cnt;
}

function LoadTagsList(data, dtat, parent) {
    var maincard = document.createElement("div");
    maincard.classList.add("card");
    parent.appendChild(maincard);
    parent = maincard;
    var int = parseInt(
        set.SettingItem("display.taglist.linecount"));
    var tag = {};
    for (var i of data.concat(dtat)) {
        for (var j of i["tags"]) {
            if (!tag[j]) {
                tag[j] = 1;
            } else {
                tag[j] += 1;
            }
        }
    }
    var tlist = Object.keys(tag);
    tlist = tlist.sort();
    while (tlist.length % int)
        tlist.push("");

    var len = tlist.length;

    for (var i = 0; i < len; i += int) {
        var lis = tlist.slice(i, Math.min(len, i + int));
        var ttag = tags.Tagsbox(lis);
        ttag.classList.add("tags-taglist");
        parent.appendChild(ttag);
        for (var j of ttag.children)
            if (j.innerText === "")
                j.classList.add("tags-placeholder");
        for (var j of ttag.children)
            if (j.innerText.length)
                j.title = "Articles " + FindCount(j.innerText, data.concat(dtat));
    }
}

function LoadShowCards(tag, arts, apps, parent) {
    for (var i of arts)
        if (i["tags"].includes(tag)) {
            var card = showcard.ArticleShowCard(i);
            parent.appendChild(card);
        }
    for (var i of apps)
        if (i["tags"].includes(tag)) {
            var card = showcard.ApplicationShowCard(i);
            parent.appendChild(card);
        }
    var tagall = document.getElementsByClassName("articles-tag");
    for (var t of tagall)
        if (t.innerText === tag) {
            t.classList.add("articles-tag-active");
        }
}

export function LoadTags(tag, data, dtat, parent) {
    if (!tag) {
        LoadTagsList(data, dtat, parent);
    } else {
        LoadShowCards(tag, data, dtat, parent);
    }
}