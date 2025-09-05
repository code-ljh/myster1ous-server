export function CateCard(cate) {
    var catecard = document.createElement("div");
    var spancard = document.createElement("a");
    catecard.classList.add("card");
    catecard.classList.add("categories-catecard");
    catecard.appendChild(spancard);
    spancard.innerText = "code-ljh://";
    spancard.href = "/categories";
    var link = "/categories/";
    for (var i of cate) {
        link += i;
        var spancard = document.createElement("a");
        catecard.appendChild(spancard);
        spancard.innerText = "/" + i;
        spancard.href = link;
        link += "/";
    } return catecard;
}

export function InsetCateCard(cate) {
    var catecard = document.createElement("div");
    var spancard = document.createElement("a");
    catecard.classList.add("card");
    catecard.classList.add("categories-insetcatecard");
    catecard.appendChild(spancard);
    spancard.innerText = "code-ljh://";
    spancard.href = "/categories";
    var link = "/categories/";
    for (var i of cate) {
        link += i;
        var spancard = document.createElement("a");
        catecard.appendChild(spancard);
        spancard.innerText = "/" + i;
        spancard.href = link;
        link += "/";
    } return catecard;
}