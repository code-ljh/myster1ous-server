import * as tags from '/script/library/tags.js';
import * as text from '/script/library/text.js'; 
import * as showcard from '/script/library/showcard.js';
import * as set from '/script/library/settings.js';
import * as category from '/script/library/categories.js';
import * as editor from '/applications/editor/editor.js';

function NowDate() {
    var date = new Date();
    return [date.getFullYear(), date.getMonth(), date.getDate()];
}

export function Articles(data, params) {
    if (params.length == 0) {
        var parent = document.getElementById("main");
        var info = set.SettingItem("display.articleslist.simplified");
        var table = document.createElement("table");
        var tbody = document.createElement("tbody");
        var thead = document.createElement("thead");
        var theadline = document.createElement("tr");
        parent.appendChild(table);
        table.classList.add("modern-table");
        table.appendChild(tbody);
        table.appendChild(thead);
        thead.appendChild(theadline);
        theadline.innerHTML = `
            <th class="simplified-table-bodyline"><p> ID </p></th>
            <th class="simplified-table-bodyline"><p> Name </p></th>
            <th class="simplified-table-bodyline-button"><p> Operate </p></th>
        `;

        for (var i of data) {
            var tbodyline = document.createElement("tr");
            var tbname = document.createElement("th");
            var tblink = document.createElement("a");
            var tbinfo = document.createElement("th");
            var tbdes = document.createElement("th");
            var tbhref = document.createElement("a");
            tbody.appendChild(tbodyline);
            tbodyline.appendChild(tbname);
            tbodyline.appendChild(tbdes);
            tbodyline.appendChild(tbinfo);
            tbname.classList.add("simplified-table-bodyline");
            tbname.appendChild(tblink);
            tblink.innerText = i["id"];
            tblink.href = `/articles/${i["id"]}`;
            tbinfo.classList.add("simplified-table-bodyline-button");
            tbinfo.appendChild(tags.FacelessTag("Edit"));
            tbdes.classList.add("simplified-table-bodyline");
            tbdes.innerText = i["name"];
            tbhref.href = `/edit/articles/${i["id"]}`;
            tbhref.classList = tbinfo.children[0].classList;
            tbhref.innerHTML = tbinfo.children[0].innerHTML;
            tbinfo.children[0].replaceWith(tbhref);
        }
    } else if (params.length == 1) {
        document.head.innerHTML += `<link rel="stylesheet" type="text/css" href="/applications/editor/editor.css">`;
        editor.UsedMain('apps-' + params[0]);

        var leftpar = document.getElementsByClassName("editor-leftbar")[0];
        var inputid = document.createElement("input");
        var inputname = document.createElement("input");
        var inputdesc = document.createElement("input");
        var inputcate = document.createElement("input");
        var inputags = document.createElement("input");
        var messagebox = document.createElement("div");
        inputid.placeholder = "ID";
        inputname.placeholder = "Name";
        inputdesc.placeholder = "Description";
        inputcate.placeholder = "Categories";
        inputid.classList.add("modern-input", "edit-art-input");
        inputname.classList.add("modern-input", "edit-art-input");
        inputdesc.classList.add("modern-input", "edit-art-input");
        inputcate.classList.add("modern-input", "edit-art-input");
        inputags.classList.add("modern-input", "edit-art-input");
        leftpar.insertBefore(inputcate, leftpar.children[0]);
        leftpar.insertBefore(inputags, leftpar.children[0]);
        leftpar.insertBefore(inputdesc, leftpar.children[0]);
        leftpar.insertBefore(inputname, leftpar.children[0]);
        leftpar.insertBefore(inputid, leftpar.children[0]);
        leftpar.appendChild(tags.FacelessTag("Submit"));
        leftpar.children[leftpar.children.length - 1].classList.add("hover-translate");
        messagebox.classList.add("edit-art-messagebox", "card");
        document.body.appendChild(messagebox);
        messagebox.innerHTML = `
            <p>
                确认修改吗？<br>
                修改时间：${(new Date()).toDateString()}
            </p>
        `;
        messagebox.appendChild(tags.LargeFacelessTag("Confirm"));
        messagebox.appendChild(tags.LargeFacelessTag("Cancel"));
        messagebox.children[messagebox.children.length - 1].classList.add("hover-opacity", "cancel", "shrinktag");
        messagebox.children[messagebox.children.length - 2].classList.add("hover-opacity", "confirm", "shrinktag");

        var dat;
        for (var i of data)
            if (i["id"] === params[0])
                dat = i;
        
        inputid.value = params[0];
        if (dat) {
            inputname.value = dat["name"];
            inputdesc.value = dat["description"];
            inputcate.value = dat["categories"].join('/');
            inputags.value = dat["tags"].join(',');

            if (leftpar.children[leftpar.children.length - 2].value.length <= 2)
                fetch(`/src/articles/${dat["id"]}.md`)
                    .then(response => response.text())
                    .then(text => {
                            leftpar.children[leftpar.children.length - 2].value = text;
                        }
                    );
        }

        leftpar.children[leftpar.children.length - 1]
            .onclick = (evt) => {
                messagebox.classList.add("editart-flex");
                setTimeout(() => {
                    messagebox.classList.add("edit-art-messagebox-shown");
                }, 10);
            };        
        
        messagebox.children[messagebox.children.length - 1]
            .onclick = (evt) => {
                messagebox.classList.remove("edit-art-messagebox-shown");
                setTimeout(() => {
                    messagebox.classList.remove("editart-flex");
                }, 500);
            };
        
        messagebox.children[messagebox.children.length - 2]
            .onclick = (evt) => {
                if (inputid.value.length) {
                    if (leftpar.children[leftpar.children.length - 2].value.length) {
                        fetch(`/edit/articles/post/${inputid.value}`, 
                            {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({
                                    'info': {
                                        'id': inputid.value,
                                        'tags': inputags.value.split(','),
                                        'categories': inputcate.value.split('/'),
                                        'time': (dat ? dat['time'] : NowDate()),
                                        'name': inputname.value,
                                        'description': inputdesc.value
                                    },
                                    'text': leftpar.children[leftpar.children.length - 2].value 
                                })
                            }
                        );
                        window.location.href = '/articles/' + inputid.value;
                    } else {
                        fetch(`/edit/articles/delete/${inputid.value}`, 
                            {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' }
                            }
                        );
                        window.location.href = '/articles';
                    }
                }
            };
    }
}