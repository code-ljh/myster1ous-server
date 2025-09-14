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
        document.getElementById("miin").innerHTML += `
            <a class="card articles-tag hover-translate" href="/articles">
                返回前台
            </a>
        `;
        parent.innerHTML += `
            <div class="card articles-tag">
                <div id="go" class="card articles-smalltag hover-translate"> 添加文章 </div>
                <input id="inputer" class="modern-input" autocomplete="off">
            </a>
        `;

        document.getElementById("go")
            .onclick = () => {
                var inp = document.getElementById("inputer");
                window.location.href = "/edit/articles/" + inp.value;
            };

        setInterval(() => {
            var inp = document.getElementById("inputer");    
            const regex = /[^a-zA-Z0-9_]/g;
            inp.value = inp.value.replace(regex, '');
        }, 10);

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
        var EDITOR = editor.UsedMain('apps-' + params[0], localStorage.getItem('apps-' + params[0]));

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
        inputags.placeholder = "Tags";
        inputid.classList.add("modern-input", "edit-art-input");
        inputname.classList.add("modern-input", "edit-art-input");
        inputdesc.classList.add("modern-input", "edit-art-input");
        inputcate.classList.add("modern-input", "edit-art-input");
        inputags.classList.add("modern-input", "edit-art-input");
        if (set.SettingItem("edit.article.description") === "top") {
            leftpar.insertBefore(inputcate, leftpar.children[0]);
            leftpar.insertBefore(inputags, leftpar.children[0]);
            leftpar.insertBefore(inputdesc, leftpar.children[0]);
            leftpar.insertBefore(inputname, leftpar.children[0]);
            leftpar.insertBefore(inputid, leftpar.children[0]);
        } else {
            var miin = document.getElementById("miin");
            miin.appendChild(inputid);
            miin.appendChild(inputname);
            miin.appendChild(inputdesc);
            miin.appendChild(inputags);
            miin.appendChild(inputcate);
            inputid.classList.add("important-left-input");
            inputname.classList.add("important-left-input");
            inputdesc.classList.add("important-left-input");
            inputags.classList.add("important-left-input");
            inputcate.classList.add("important-left-input");
        }
        leftpar.appendChild(tags.FacelessTag("Submit"));
        leftpar.children[leftpar.children.length - 1].classList.add("hover-translate");
        messagebox.classList.add("edit-art-messagebox", "card");
        document.body.appendChild(messagebox);
        messagebox.innerHTML = `
            <p>
                确认修改吗？<br>
                防止误触，请输入密码。<br>
                修改时间：${(new Date()).toDateString()}
            </p>

            <input id="password-input" class="modern-input" autocomplete="off"> 
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
        inputid.readOnly = true;
        if (dat) {
            inputname.value = dat["name"];
            inputdesc.value = dat["description"];
            inputcate.value = dat["categories"].join('/');
            inputags.value = dat["tags"].join(',');

            fetch(`/src/articles/${dat["id"]}.md`)
                .then(response => 
                    response.text()
                ).then(
                    text => {
                        EDITOR.dispatch(
                            {
                                changes: { 
                                    from: 0, 
                                    to: EDITOR.state.doc.length, 
                                    insert: text 
                                }
                            }
                        );
                    }
                );
        } else {
            function GET(tag) {
                var e = localStorage.getItem(params[0] + ".eee." + tag);
                if (!e) return "";
                return e;
            }

            inputname.value = GET("name");
            inputdesc.value = GET("description");
            inputcate.value = GET("categories");
            inputags.value = GET("tags");

            setInterval(() => {
                localStorage.setItem(params[0] + ".eee.name", inputname.value);
                localStorage.setItem(params[0] + ".eee.description", inputdesc.value);
                localStorage.setItem(params[0] + ".eee.categories", inputcate.value);
                localStorage.setItem(params[0] + ".eee.tags", inputags.value);
            });
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
                    if (EDITOR.state.doc.toString().length) {
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
                                    'text': EDITOR.state.doc.toString(),
                                    'password': document.getElementById("password-input").value
                                })
                            }
                        ).then(response => {
                            if (response.ok) {
                                window.location.href = '/articles/' + inputid.value;
                            } else { 
                                document.getElementById("password-input").value = "wrong password";
                            }
                        });
                    } else {
                        fetch(`/edit/articles/delete/${inputid.value}`, 
                            {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(
                                    {
                                        'password': document.getElementById("password-input").value
                                    }
                                )
                            }
                        ).then(response => {
                            if (response.ok) {
                                window.location.href = '/articles';
                            } else {
                                document.getElementById("password-input").value = "wrong password";
                            }
                        });
                    }
                }
            };
    }
}