import * as category from "/script/library/categories.js";
import * as set from '/script/library/settings.js';

var dm = set.SettingItem("display.brightness");
var GlobalARTS, GlobalAPPS;

function IsPrefix(cate, prefix) {
    if (prefix.length >= cate.length) return false;
    for (var i = 0; i < prefix.length; i++)
        if (prefix[i] !== cate[i])
            return false;
    return true;
}

function IsSame(cate, pref) {
    if (cate.length != pref.length) return false;
    for (var i = 0; i < pref.length; i++)
        if (pref[i] !== cate[i])
            return false;
    return true;
}

function CateTableItem(id, name, type, link, imglink, tsize) {
    var tbl = document.createElement("tr");
    var tbn = document.createElement("th");
    var tbi = document.createElement("th");
    var tbt = document.createElement("th");
    var tbsz = document.createElement("th");
    var tblink = document.createElement("a");
    var tbimg = document.createElement("img");
    tbl.appendChild(tbi);
    tbl.appendChild(tbn);
    tbl.appendChild(tbt);
    tbl.appendChild(tbsz);
    tbl.classList.add(`categories-table-${type}`);
    tbi.appendChild(tbimg);
    tbi.appendChild(tblink);
    tbi.classList.add("categories-table-body");
    tbn.classList.add("categories-table-body");
    tbn.innerText = name;
    tbt.classList.add("categories-table-body");
    tbsz.classList.add("categories-table-body");
    tbt.innerText = type;
    tblink.innerText = id;
    tblink.href = link;
    tbimg.src = imglink;
    tbimg.classList.add("categories-table-image");

    var VALUE = 0;
    for (var i of GlobalAPPS) {
        var LINK = '/categories/' + i["categories"].join('/');
        if (LINK.includes(link))    
            VALUE += 1;
    }
    for (var i of GlobalARTS) {
        var LINK = '/categories/' + i["categories"].join('/');
        if (LINK.includes(link))    
            VALUE += 1;
    }
    console.log(GlobalAPPS, GlobalARTS, VALUE, link);
    tbsz.innerText = (tsize == 1 ? "1" : VALUE);
    return tbl;
}

export function LoadCategories(cate, arts, apps, parent) {
    GlobalAPPS = apps;
    GlobalARTS = arts;
    var list = [];
    var currentarts = [];
    var currentapps = [];
    var currentfold = new Set();
    var catecard = category.CateCard(cate);
    parent.appendChild(catecard);
    var table = document.createElement("table");
    var thead = document.createElement("thead");
    var tbody = document.createElement("tbody");
    var theadline = document.createElement("tr");
    var tid = document.createElement("th");
    var tname = document.createElement("th");
    var ttype = document.createElement("th");
    var tsize = document.createElement("th");
    parent.appendChild(table);
    table.classList.add("modern-table");
    table.appendChild(thead);
    table.appendChild(tbody);
    thead.appendChild(theadline);
    theadline.appendChild(tid);
    theadline.appendChild(tname);
    theadline.appendChild(ttype);
    theadline.appendChild(tsize);
    tname.innerText = "Name";
    tname.classList.add("categories-table-head");
    tid.innerText = "ID";
    tid.classList.add("categories-table-head");
    ttype.innerText = "Type";
    ttype.classList.add("categories-table-head");
    tsize.innerText = "Size";
    tsize.classList.add("categories-table-head");
    for (var i of arts) {
        if (IsSame(cate, i["categories"])) {
            currentarts.push(i);
        }
    }
    for (var i of apps) {
        if (IsSame(cate, i["categories"])) {
            currentapps.push(i);
        }
    }
    var both = arts.concat(apps);
    for (var i of both) {
        if (IsPrefix(i["categories"], cate)) {
            currentfold.add("/" + i["categories"].slice(0, cate.length + 1).join("/"));
        }
    }
    if (cate.length) {
        tbody.appendChild(CateTableItem("../", "back", 
            "folder",
            (cate.length == 1 ?
                "/categories" :
                `/categories/${cate.slice(0, cate.length - 1).join('/')}`),
            `/asset/${dm}/images-svg/back.svg`, -1
        ));
    }
    for (var i of currentfold) {
        tbody.appendChild(CateTableItem(i, 
            i.slice(i.lastIndexOf('/') + 1, i.length), "folder",
            `/categories/${i.split("/").slice(1).join("/")}`,
            `/asset/${dm}/images-svg/categories.svg`, -1
        ));
    }
    for (var i of currentarts) {
        tbody.appendChild(CateTableItem(i["id"], 
            i["name"], "articles",
            `/articles/${i["id"]}`,
            `/asset/${dm}/images-svg/article.svg`, 1
        ));
    }
    for (var i of currentapps) {
        tbody.appendChild(CateTableItem(i["id"], 
            i["name"], "applications",
            `/${i["id"]}`,
            `/asset/${dm}/images-svg/applications.svg`, 1
        ));
    }
}