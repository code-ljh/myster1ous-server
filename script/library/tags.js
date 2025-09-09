import * as set from '/script/library/settings.js';

var dm = set.SettingItem("display.brightness");

export function Tag(name) {
    var result = document.createElement("a");
    var image = document.createElement("img");
    var passage = document.createElement("p");
    result.classList.add("card");
    result.classList.add("articles-tag");
    result.href = `/tags/${name}`;
    result.appendChild(image);
    result.appendChild(passage);
    image.src = `/asset/${dm}/images-svg/tag.svg`
    passage.innerText = name;
    return result;
}

export function SmallTag(name) {
    var result = document.createElement("a");
    var image = document.createElement("img");
    var passage = document.createElement("p");
    result.classList.add("card");
    result.classList.add("articles-smalltag");
    result.href = `/tags/${name}`;
    result.appendChild(image);
    result.appendChild(passage);
    image.src = `/asset/${dm}/images-svg/tag.svg`
    passage.innerText = name;
    return result;
}

export function Tagsbox(taglist) {
    var result = document.createElement("div");
    result.classList.add("articles-tagbox");
    for (var i of taglist) {
        var tag = Tag(i);
        tag.classList.add("hover-translate");
        result.appendChild(tag);
    }
    return result;
}

export function SmallTagsbox(taglist) {
    var result = document.createElement("div");
    result.classList.add("articles-tagbox");
    for (var i of taglist) {
        var tag = SmallTag(i);
        tag.classList.add("hover-translate");
        result.appendChild(tag);
    }
    return result;
}

export function FacelessTag(name) {
    var result = document.createElement("div");
    var passage = document.createElement("p");
    result.classList.add("card");
    result.classList.add("articles-smalltag");
    result.appendChild(passage);
    passage.innerText = name;
    return result;
}

export function LargeFacelessTag(name) {
    var result = document.createElement("div");
    var passage = document.createElement("p");
    result.classList.add("card");
    result.classList.add("articles-tag");
    result.appendChild(passage);
    passage.innerText = name;
    return result;    
}

export function FacelessTagsbox(taglist) {
    var result = document.createElement("div");
    result.classList.add("articles-tagbox");
    for (var i of taglist) {
        var tag = FacelessTag(i);
        tag.classList.add("hover-translate");
        result.appendChild(tag);
    }
    return result;
}

export function LargeFacelessTagsbox(taglist) {
    var result = document.createElement("div");
    result.classList.add("articles-tagbox");
    for (var i of taglist) {
        var tag = LargeFacelessTag(i);
        tag.classList.add("hover-translate");
        result.appendChild(tag);
    }
    return result;
}
