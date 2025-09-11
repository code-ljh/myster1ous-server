var NAME = ["暂无评定", "入门", "普及-", "普及/提高-", "普及+/提高", "提高+/省选-", "省选/NOI-", "NOI/NOI+/CTSC"];
var COLOR = ["rgb(191, 191, 191)", "rgb(254, 76, 97)", "rgb(243, 156, 17)", "rgb(255, 193, 22)", "rgb(82, 196, 26)", "rgb(52, 152, 219)", "rgb(157, 61, 207)", "rgb(14, 29, 105)"];

export function LoadCompare(data1, data2) {
    var parent = document.getElementById("main");
    parent.innerHTML = `
        <div class="card compare-item">
            <h2>${data1[0]}</h2>
            <table class="modern-table">  
                <thead>
                    <tr>
                        <th> Difficulty </th>
                        <th> Force </th>
                    </tr>
                </thead>

                <tbody>
                </tbody>
            </table>
        </div>
        <div class="card compare-item">
            <h2>${data2[0]}</h2>
            <table class="modern-table">  
                <thead>
                    <tr>
                        <th> Difficulty </th>
                        <th> Force </th>
                    </tr>
                </thead>

                <tbody>
                </tbody>
            </table>
            <a class="articles-smalltag card" href="/luogu/compare">
                Return
            </a>
        </div>
    `;
    parent.classList.add("luogu-compare-main");
    console.log(data1, data2);

    var A = parent.children[0].children[1].children[1];
    var B = parent.children[1].children[1].children[1];

    for (var i = 1; i < 9; i++) {
        A.innerHTML += `
            <tr>
                <th> <div class="card articles-smalltag luogu-compare-tag" style="background-color: ${COLOR[i - 1]}">${NAME[i - 1]}</div> </th>
                <th> ${data1[i]} </th>
            </tr>
        `;

        B.innerHTML += `
            <tr>
                <th> <div class="card articles-smalltag luogu-compare-tag" style="background-color: ${COLOR[i - 1]};">${NAME[i - 1]}</div> </th>
                <th> ${data2[i]} </th>
            </tr>
        `;

        var AA = A.children[A.children.length - 1].children[1];
        var BB = B.children[B.children.length - 1].children[1];
        if (data1[i] < data2[i]) {
            AA.classList.add("compare-lose");
            BB.classList.add("compare-win");
        } else if (data1[i] === data2[i]) {
            AA.classList.add("compare-equal");
            BB.classList.add("compare-equal");
        } else {
            AA.classList.add("compare-win");
            BB.classList.add("compare-lose");
        }
    }
}

export function LoadCompareMain(data1) {
    var parent = document.getElementById("main");
    parent.innerHTML = `
        <div class="card compare-item">
            <h2>${data1[0]}</h2>
            <table class="modern-table">  
                <thead>
                    <tr>
                        <th> Difficulty </th>
                        <th> Force </th>
                    </tr>
                </thead>

                <tbody>
                </tbody>
            </table>
        </div>
        <div class="card compare-item">
            <h2>Comparer</h2>
            <table class="modern-table">  
                <thead>
                    <tr>
                        <th> Name </th>
                        <th> Force </th>
                    </tr>
                </thead>

                <tbody>
                    <tr>
                        <th> <input pattern="[a-zA-Z0-9]+" class="modern-input" id="inputer" autocomplete="off"> </th>
                        <th> <div class="hover-translate card articles-smalltag" id="compare-now"> Compare </div> </th>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
    parent.classList.add("luogu-compare-main");

    var A = parent.children[0].children[1].children[1];
    // var B = parent.children[1].children[1].children[1];

    for (var i = 1; i < 9; i++) {
        A.innerHTML += `
            <tr>
                <th> <div class="card articles-smalltag luogu-compare-tag" style="background-color: ${COLOR[i - 1]}">${NAME[i - 1]}</div> </th>
                <th> ${data1[i]} </th>
            </tr>
        `;

        var AA = A.children[A.children.length - 1].children[1];
    }
    
    document.getElementById("compare-now")
        .onclick = (evt) => {
            var inp = document.getElementById("inputer"); 
            window.location.href = `/luogu/compare/${inp.value}`;
        };

    setInterval(() => {
        var inp = document.getElementById("inputer");    
        const regex = /[^a-zA-Z0-9_]/g;
        inp.value = inp.value.replace(regex, '');
    }, 10);
    
    document.body
        .addEventListener('keydown', (evt) => {
            if (evt.key === "Enter" && document.getElementById("inputer") === document.activeElement) {
                var inp = document.getElementById("inputer"); 
                window.location.href = `/luogu/compare/${inp.value}`;
            }
        });
}