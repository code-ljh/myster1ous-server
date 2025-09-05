import * as tags from '/script/library/tags.js';
import * as text from '/script/library/text.js'; 
import * as showcard from '/script/library/showcard.js';
import * as set from '/script/library/settings.js';
import * as category from '/script/library/categories.js';

export function AddArticleCards(data, parent) {
    for (var i of data) {
        parent.appendChild(showcard.ArticleShowCard(i));
    }
}

export function AddArticleTable(data, parent) {
    var info = set.SettingItem("display.articleslist.simplified");
    var table = document.createElement("table");
    var thead = document.createElement("thead");
    var tbody = document.createElement("tbody");
    var theadline = document.createElement("tr");
    var trname = document.createElement("th");
    var trinfo = document.createElement("th");
    var tritag = document.createElement("span");
    var trsplit = document.createElement("span");
    var trcate = document.createElement("span");
    parent.appendChild(table);
    table.classList.add("modern-table");
    table.appendChild(thead);
    table.appendChild(tbody);
    thead.appendChild(theadline);
    theadline.appendChild(trname);
    theadline.appendChild(trinfo);
    trname.classList.add("simplified-table-headline");
    trname.innerText = "name";
    trinfo.classList.add("simplified-table-headline");
    trinfo.appendChild(tritag);
    trinfo.appendChild(trsplit);
    trinfo.appendChild(trcate);
    tritag.innerText = "tags";
    trsplit.innerText = "|";
    trcate.innerText = "categories";

    tritag.onclick = () => {
        set.UpdateItem("display.articleslist.simplified", "tags");
        window.location = "/articles";
    };

    trcate.onclick = () => {
        set.UpdateItem("display.articleslist.simplified", "categories");
        window.location = "/articles";
    }

    if (info === "tags") {
        tritag.classList.add("tart-active-span");
    } else {
        trcate.classList.add("tart-active-span");
    }

    for (var i of data) {
        var tbodyline = document.createElement("tr");
        var tbname = document.createElement("th");
        var tblink = document.createElement("a");
        var tbinfo = document.createElement("th");
        tbody.appendChild(tbodyline);
        tbodyline.appendChild(tbname);
        tbodyline.appendChild(tbinfo);
        tbname.classList.add("simplified-table-bodyline");
        tbname.appendChild(tblink);
        tblink.innerText = i["name"];
        tblink.href = `/articles/${i["id"]}`;
        tbinfo.classList.add("simplified-table-bodyline");

        if (info === "tags") {
            tbinfo.appendChild(tags.SmallTagsbox(i["tags"]));
        } else {
            tbinfo.appendChild(category.InsetCateCard(i["categories"]));
        }
    }
}

export function LoadArticlePage(data, parent) {
    function LoadArticleLastCard(data) {
        var lastcard = document.createElement("div");
        var catetext = document.createElement("a");
        var timetext = document.createElement("p");
        var tagslist = tags.Tagsbox(data["tags"]);
        lastcard.classList.add("card");
        lastcard.classList.add("articles-lastcard");
        lastcard.appendChild(catetext);
        lastcard.appendChild(timetext);
        lastcard.appendChild(tagslist);
        catetext.classList.add("articles-lastext");
        catetext.innerText = `Posted as /${data["categories"].join("/")}/${data["id"]}.arc`;
        catetext.href = `/categories/${data["categories"].join("/")}`;
        timetext.classList.add("articles-lastext");
        timetext.innerText = `Posted in ${data["time"][0]}/${data["time"][1]}/${data["time"][2]}`;
        return lastcard;
    }

    document.title = `${data["name"]} | code-ljh 的小站`; 
    var miin = document.getElementById("miin");
    var title = document.createElement("b");
    var descr = document.createElement("p");
    var maincard = document.createElement("div");

    var lastcard = LoadArticleLastCard(data);
    parent.appendChild(maincard);
    parent.appendChild(lastcard);
    maincard.classList.add("card");
    maincard.classList.add("articles-maincard");
    maincard.innerText = "内容加载中......";
    miin.appendChild(title);
    miin.appendChild(descr);
    title.classList.add("articles-miintext");
    title.innerText = "文章描述";
    descr.classList.add("articles-miintext");
    descr.innerText = data["description"];

    fetch(`/src/articles/${data["id"]}.md`)
        .then(response => response.text())
        .then(txt => {
            setTimeout(
                () => {
                    var size = document.createElement("p");
                    miin.appendChild(size);
                    size.classList.add("articles-miintext");
                    size.innerText = `本文大小 ${txt.length} 字节。`;
                    text.Text(txt, maincard);
                }, 400
            );
        });
}