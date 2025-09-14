var Cheerio = require("cheerio");
var Fs = require('fs');

function GetMarkdown(id, handle, canStore=false) {
    if (canStore && Fs.existsSync('storage/luogu/problemset/' + id + ".md")) {
        handle(Fs.readFileSync('storage/luogu/problemset/' + id + '.md', 'utf-8'));
        return;
    }

    var url = `https://www.luogu.com.cn/problem/${id}`;
    fetch(url)
        .then(response => {
            if (response.status !== 200) return undefined;
            return response.text();
        })
        .then(text => {
            if (!text) return handle(undefined);
            var A = Cheerio.load(text);
            var B = A('article section');
            var E = "";
            var T = A('#lentille-context');
            var F = JSON.parse(T.html()).data.problem;
            E = [
                `# [${F.pid} ${F.title}](https://www.luogu.com.cn/problem/${F.pid})`
            ];
            if (F.content.background && F.content.background.length) {
                E.push(`## 题目背景`);
                E.push(F.content.background);
            }
            E.push(
                `## 题目描述`,
                `${F.content.description}`,
                `## 输入格式`,
                `${F.content.formatI}`,
                `## 输出格式`,
                `${F.content.formatO}`
            );

            if (F.samples.length) {
                E.push("## 输入输出样例");
            }
            var sample = 0;
            for (var i of F.samples) {
                E.push("#### 样例" + sample);
                E.push("```plain", i[0], "```", "```plain", i[1], "```");
                sample += 1;
            }

            if (F.content.hint && F.content.hint.length)
                E.push(
                    `## 说明与提示`,
                    `${F.content.hint}`
                );

            E = E.join('\n');
            handle(E);
        });
}

function GetUserPractice(id, handle) {
    GetPracticeJson(id, (data) => {
        if (!data.passedProblems) {
            handle([0, 0, 0, 0, 0, 0, 0, 0, 0], data);
        } else {
            var e = [0, 0, 0, 0, 0, 0, 0, 0, 0];

            for (var i of data.passedProblems)
                e[i.difficulty] += 1;

            handle(e, data);
        }
    });
}

function GetPracticeJson(uid, handle) {
    function AfterSearch(uid, handle) {
        fetch(`https://www.luogu.com.cn/user/${uid}`)
            .then(response => response.text())
            .then(json => {
                var jsonData = {};
                const $ = Cheerio.load(json);
                $('script').each((index, element) => {
                    const scriptContent = $(element).html();

                    if (scriptContent && scriptContent.includes('window._feInjection')) {

                        const match = scriptContent.match(/decodeURIComponent\("((?:.|\n)*?)"\)/);

                        if (match && match[1]) {
                            const encodedData = match[1];

                            const decodedData = decodeURIComponent(encodedData);
                            jsonData = JSON.parse(decodedData);

                            Fs.writeFileSync('storage/luogu/userdata/' + uid + '.json', JSON.stringify(jsonData.currentData), 'utf-8');
                            handle(jsonData.currentData);

                            return false;
                        }
                    }
                });
            });
    }
    fetch('https://www.luogu.com.cn/api/user/search?keyword=' + uid)
        .then(response => response.json())
        .then(json => {
            try {
                AfterSearch(json.users[0].uid, handle);
            } catch {
                AfterSearch(528472, handle);
            }
        });
}

module.exports = {
    GetMarkdown,
    GetUserPractice
};