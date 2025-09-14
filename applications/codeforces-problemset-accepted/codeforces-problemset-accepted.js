export function Main(param) {
    console.log(param);
    if (param.length == 0) param.push('Juruoljh');
    var parent = document.getElementById("main");
    parent.innerHTML = `
        <div class="card"> <p> 正在加载中。。。 </p> </div>
    `;
    try {
        fetch('https://codeforces.com/api/user.status?handle=' + param[0])
            .then(response => response.json())
            .then(json => {
                json = json.result;
                var k = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                var e = [];
                var st = [];
                for (var i in k) e.push([]);
                console.log(e);
                for (var i of json) {
                    if (i.verdict === 'OK') {
                        if (i.problem && i.problem.rating) {
                            var name = "CF" + i.problem.contestId + i.problem.index;
                            var rate = i.problem.rating / 100 - 8;
                            if (!st.includes(name)) {
                                st.push(name);
                                k[rate] += 1;
                                e[rate].push(name);
                            }
                        }
                    }
                }
                parent.innerHTML = `
                <table class="modern-table">
                    <thead>
                        <tr>
                            <th> Difficulty </th>
                            <th> Total </th>
                            <th> Problems </th>
                        </tr>
                    </thead>

                    <tbody id="mainbody">
                    </tbody>
                </table>
            `;
                var bd = document.getElementById("mainbody");
                for (var i = 0; i < k.length && 800 + i * 100 <= 3500; i++) {
                    var rate = 800 + i * 100;
                    var tr = document.createElement("tr");
                    var th1 = document.createElement("th");
                    var th3 = document.createElement("th");
                    var th2 = document.createElement("th");
                    bd.appendChild(tr);
                    tr.appendChild(th1);
                    tr.appendChild(th3);
                    tr.appendChild(th2);
                    th1.innerHTML = `<p> *${rate} </p>`;
                    th3.innerHTML = `<p> ${k[i]} </p>`;
                    for (var j of e[i])
                        th2.innerHTML += `<a href="https://luogu.com.cn/problem/${j}"> ${j} </a>`;
                }
            });
    } catch {
        parent.innerHTML = `<div class="card"> <p> 404 出错了。 </p> </div>`;
    }
    
}