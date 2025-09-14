import * as tags from '/script/library/tags.js';
import * as category from '/script/library/categories.js';

export function ArticleShowCard(i) {
    var result = document.createElement("a");
    var title = document.createElement("h3");
    var description = document.createElement("p");
    var tagsbox = tags.Tagsbox(i["tags"]);
    var catebox = category.CateCard(i["categories"]);
    result.classList.add("card");
    result.classList.add("articles-showcard");
    result.href = `/articles/${i["id"]}`;
    result.appendChild(title);
    result.appendChild(description);
    result.appendChild(catebox);
    result.appendChild(tagsbox);
    title.innerText = i["name"];
    description.innerText = i["description"];
    return result;
}

export function ApplicationShowCard(i) {
    var result = document.createElement("a");
    var title = document.createElement("h3");
    var description = document.createElement("p");
    var tagsbox = tags.Tagsbox(i["tags"]);
    var catebox = category.CateCard(i["categories"]);
    result.classList.add("card");
    result.classList.add("articles-apps-showcard");
    result.href = `/${i["id"]}`;
    result.appendChild(title);
    result.appendChild(description);
    result.appendChild(catebox);
    result.appendChild(tagsbox);
    title.innerText = i["name"];
    description.innerText = i["description"];
    return result;
}