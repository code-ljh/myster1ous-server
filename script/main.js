import * as tags from '/script/library/tags.js';
import * as text from '/script/library/text.js'; 
import * as showcard from '/script/library/showcard.js';
import * as set from '/script/library/settings.js';
import * as articles from '/script/pages/articles.js';
import * as categories from '/script/pages/categories.js';
import * as pagestags from '/script/pages/tags.js';
import * as applist from '/script/pages/applications.js';
import * as backend from '/script/backend-main.js';

export function LoadAll(tabname, params) {
    document.title = `${tabname} | code-ljh.github.io`;

    function loadapplications(data) {
        var type = set.SettingItem("display.appslist");
        if (params.length == 1) {
            console.log(params[0]);
            var link = `/applications/${params[0]}/${params[0]}.js`;
            var eee = `/applications/${params[0]}/${params[0]}.css`;
            console.log(eee);
            document.head.innerHTML += `<link rel="stylesheet" href=${eee}>`;
            import(link)
                .then((val) => {
                    val.Main();
                    var found;
                    for (var i of data)
                        if (i["id"] === params[0])
                            found = i;
                    document.title = found["name"] + " | code-ljh.github.io";
                });
        } else {
            var parent = document.getElementById("main");
            if (type === "traditional") {
                for (var i of data) 
                    parent.appendChild(
                        showcard.ApplicationShowCard(i));
            } else {
                applist.Application(parent, data);
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
                break;
            
            case "articles":
                tabarticles.classList.add("template-navitem-chosen");
                tabarticles.href = "/edit/articles";
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
                        tabarticles.href = "/articles";
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


