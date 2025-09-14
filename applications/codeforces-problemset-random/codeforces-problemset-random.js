var parent = document.getElementById("main");

function OnClickList() {
    var i1 = document.getElementById("input1");
    var i2 = document.getElementById("input2");
    var A = parseInt(i1.value), B = parseInt(i2.value);
    if (A < 800 || A > 3500 || B < 800 || B > 3500) return;
    if (A > B) {
        var C = A;
        A = B; B = C;
    }
    fetch('/storage/codeforces/problemset.json')
        .then(response => response.json())
        .then(json => {
            var D = [];
            for (var i of json.result.problems) {
                if (i.rating && A <= i.rating && i.rating <= B) {
                    D.push(i);
                }
            }
            console.log(D);
            while (parent.children[parent.children.length - 1].id !== ("cpr-maindiv")) {
                parent.removeChild(parent.children[parent.children.length - 1]);
            }
            var TITLE = document.createElement("h2");
            TITLE.innerText = `在 *${A} 和 *${B} 之间找到了 ${D.length} 个结果。`;
            parent.appendChild(TITLE);
            var TABLE = document.createElement("table");
            parent.appendChild(TABLE);
            TABLE.classList.add("modern-table");
            TABLE.classList.add("table-table");
            TABLE.innerHTML += `
                <thead> 
                    <tr> 
                        <th> ID </th> 
                        <th> Name </th> 
                        <th> Rating </th> 
                    </tr> 
                </thead>
                <tbody>
                </tbody>
            `;
            TABLE = TABLE.children[1];
            (function Refresh(page) {
                console.log(page);
                TABLE.innerHTML = `
                    <tr>
                        <th>
                            <div class="cpr1">
                                <div class="card articles-smalltag hover-translate" id="minus-minus"><p>--</p></div> 
                                <div class="card articles-smalltag hover-translate" id="minus"><p>-</p></div>
                            </div> 
                        </th>
                        <th> Current Page: ${Math.floor(page / 20 + 1)} </th>
                        <th>
                            <div class="cpr1">
                                <div class="card articles-smalltag hover-translate" id="plus"><p>+</p></div> 
                                <div class="card articles-smalltag hover-translate" id="plus-plus"><p>++</p></div> 
                            </div>
                        </th>
                    </tr>
                `;
                if (page + 20 < D.length)
                    document.getElementById("plus").onclick = 
                        (evt) => {
                            Refresh(page + 20);
                        };
                if (page)
                    document.getElementById("minus").onclick =
                        () => {
                            Refresh(page - 20);
                        };
                if (page + 200 < D.length)
                    document.getElementById("plus-plus").onclick = 
                        (evt) => {
                            Refresh(page + 200);
                        };
                if (page >= 200)
                    document.getElementById("minus-minus").onclick =
                        () => {
                            Refresh(page - 200);
                        };
                for (var i = page; i < page + 20 && i < D.length; i++) {
                    var TR = document.createElement("tr");
                    TR.innerHTML = `
                        <th> CF${D[i].contestId}${D[i].index} </th>
                        <th> ${D[i].name} </th>
                        <th> ${D[i].rating} </th>
                    `;
                    TABLE.appendChild(TR);
                }
            })(0);
        });
}

function OnClickRandom() {
    var i1 = document.getElementById("input1");
    var i2 = document.getElementById("input2");
    var A = parseInt(i1.value), B = parseInt(i2.value);
    if (A < 800 || A > 3500 || B < 800 || B > 3500) return;
    if (A > B) {
        var C = A;
        A = B; B = C;
    }
    fetch('/storage/codeforces/problemset.json')
        .then(response => response.json())
        .then(json => {
            var D = [];
            for (var i of json.result.problems) {
                if (i.rating && A <= i.rating && i.rating <= B) {
                    D.push(i);
                }
            }

            var rnd = Math.floor(Math.random() * D.length);
            window.location.href = `https://codeforces.com/problemset/problem/${D[rnd].contestId}/${D[rnd].index}`;
        });
}

export function Main() {
    parent.innerHTML = `
        <div class="cpr-maindiv" id="cpr-maindiv">
            <input type="number" min="800" max="3500" class="modern-input" id="input1" value="2300">
            <input type="number" min="800" max="3500" class="modern-input" id="input2" value="2300">
            <div class="articles-tag card hover-translate"> Random </div>
        </div>
    `;

    setInterval(OnClickList, 1000);
    parent.children[0].children[2].onclick = OnClickRandom;
}