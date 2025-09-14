import * as tags from '/script/library/tags.js';
import * as text from '/script/library/text.js';
import * as showcard from '/script/library/showcard.js';
import * as set from '/script/library/settings.js';
import * as articles from '/script/pages/articles.js';
import * as categories from '/script/pages/categories.js';
import * as pagestags from '/script/pages/tags.js';
import * as applist from '/script/pages/applications.js';
import * as backend from '/script/backend-main.js';

import * as luoguCompare from '/script/luogu/compare.js';
import * as home from '/script/pages/home.js';

export function LoadAll(tabname, params) {
    document.title = `${tabname} | code-ljh.github.io`;

    function loadapplications(data) {
        var type = set.SettingItem("display.appslist");
        if (params.length == 0) {
            var parent = document.getElementById("main");
            if (type === "traditional") {
                for (var i of data)
                    parent.appendChild(
                        showcard.ApplicationShowCard(i));
            } else {
                applist.Application(parent, data);
            }
        } else if (params[0] === "luogu" && params.length == 2) {
            var text = (params[1][1]);
            text = text.split('\n');
            var eee = [];
            for (var i of text) eee.push(i);
            text = eee.join('\n');
            var main = document.getElementById("miin");
            main.innerHTML += `<div id="index" class="card articles-tag hover-translate"> Update </div>`;
            articles.LoadArticlePageMD(text, document.getElementById("main"));

            document.getElementById("index")
                .onclick = () => {
                    fetch('/api/luogu/problem/update/' + params[1][0], {
                        'method': 'POST'
                    }).then(() => {
                        window.location.href = window.location.href;
                    });
                };
        } else if (params.length <= 2) {
            var par = params[0].replaceAll('/', '-');
            var link = `/applications/${par}/${par}.js`;
            var eee = `/applications/${par}/${par}.css`;
            document.head.innerHTML += `<link rel="stylesheet" href=${eee}>`;
            import(link)
                .then((val) => {
                    try {
                        val.Main(params.slice(1));
                    } catch {
                        val.Main();
                    }
                    var found;
                    for (var i of data)
                        if (i["id"] === params[0])
                            found = i;
                    document.title = found["name"] + " | code-ljh.github.io";
                });
        } else if (params[1] === "compare") {
            if (params[3] === "list") {
                luoguCompare.LoadCompareMain(params[2]);
            } else {
                var s1 = params[2];
                var s2 = params[3];
                luoguCompare.LoadCompare(s1, s2);
            }
        } else if (params.length == 5) {
            if (params[0] === 'luogu-problems') {
                document.getElementById("main").innerHTML = `
                    <div class="home-compare-card card">
                        <h5> Problem </h5>
                        <div class="home-compare">
                            <input class="modern-input" id="inputer2" autocomplete="off">
                            <div class="articles-smalltag card hover-translate" id="go2"> GO </div>
                        </div>
                    </div>
                `;

                document.getElementById("go2")
                    .onclick = () => {
                        var inp = document.getElementById("inputer2");
                        window.location.href = "/luogu/problem/" + inp.value;
                    };
                var inp = document.getElementById("inputer2");  
                inp.value = "P1001";
            }
        }
    }

    function loadarticles(data) {
        var parent = document.getElementById("main");
        var type = set.SettingItem("display.articleslist");
        var miin = document.getElementById("miin");
        if (params.length == 0) {
            if (type === "traditional") {
                articles.AddArticleCards(data, parent);
            } else {
                articles.AddArticleTable(data, parent);
            }
        } else {
            for (var i of data) {
                if (i["id"] === params[0]) {
                    articles.LoadArticlePage(i, parent);
                }
            }
        }
    }

    function loadcategories(data, dtat) {
        var parent = document.getElementById("main");
        var cate = params[0];
        if (cate) cate = cate.split("/");
        else cate = [];
        categories.LoadCategories(cate, data, dtat, parent);
    }

    function loadtags(data, dtat) {
        var parent = document.getElementById("main");
        pagestags.LoadTags(params[0], data, dtat, parent);
    }

    function StartLoading(arts, apps) {
        var tabhome = document.getElementById("tab-home");
        var tabarticles = document.getElementById("tab-articles");
        var tabtags = document.getElementById("tab-tags");
        var tabcategories = document.getElementById("tab-categories");
        var tabapplications = document.getElementById("tab-applications");

        switch (tabname) {
            case "home":
                tabhome.classList.add("template-navitem-chosen");
                home.loadhome(params);
                break;

            case "articles":
                tabarticles.classList.add("template-navitem-chosen");
                loadarticles(arts);
                break;

            case "tags":
                tabtags.classList.add("template-navitem-chosen");
                loadtags(arts, apps);
                break;

            case "categories":
                tabcategories.classList.add("template-navitem-chosen");
                loadcategories(arts, apps);
                break;

            case "applications":
                tabapplications.classList.add("template-navitem-chosen");
                loadapplications(apps);
                break;

            case "back-end":
                switch (params[0]) {
                    case 'articles':
                        tabarticles.classList.add("template-navitem-chosen");
                        backend.Articles(arts, params.slice(1));
                        break;

                    case 'applications':
                        tabarticles.classList.add("template-navitem-chosen");
                        backend.Applications(apps, params.slice(1));
                        break;
                }
                break;

            default:
                console.error("Unrecognizable tabname.");
                break;
        }
    }

    (function main() {
        fetch(`/src/applications.json`)
            .then(response => response.json())
            .then(data => {

                fetch(`/src/articles.json`)
                    .then(response => response.json())
                    .then(dtat => {
                        StartLoading(dtat, data);
                    })
            });
    })();
}


