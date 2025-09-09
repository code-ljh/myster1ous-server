var Express = require("express");
var Fs = require('fs');
var Path = require('path');
var MainPath = "D://server";
var App = Express();

const PATH_DATABASE = "database.json";
const PATH_TEMPLATE = "html/template.html";
// const PATH_MAIN_JS = "script/main.js";

function ReadData() {
    var data = Fs.readFileSync(PATH_DATABASE);
    return JSON.parse(data);
}

function ReadText(path) {
    var data = Fs.readFileSync(path, 'utf-8');
    return data;
}

App.use(Express.static('.'));
App.use(Express.json());
App.use(Express.urlencoded({ extended: true }));

function Template(Tabname, List) {
    var String = "[";
    for (var i of List)
        String += "\"" + i + "\",";
    var FormatList = String + "]";
    return (`
        <!DOCTYPE html>
        <body style="background-color:black">
        </body>
        <script type="module">
            import * as template from '/script/template/load.js';
            import * as loadscripts from '/script/template/script.js';
            import * as Main from '/script/main.js';
            loadscripts.LoadScripts();
            template.LoadTemplate(document.body, "${Tabname}");
            Main.LoadAll("${Tabname}", ${FormatList});
        </script>
    `);
}

App.get('/', (request, result) => {
    result.send(Template("home", []));
});

App.get('/articles', (request, result) => {
    result.send(Template("articles", []));
});

App.get('/articles/:id', (request, result) => {
    result.send(Template("articles", [request.params.id]));
});

App.get(/^\/categories(.*)/, (request, result) => {
    result.send(Template("categories", [request.params[0].slice(1)]));
});

App.get('/tags', (request, result) => {
    result.send(Template("tags", []));
});

App.get('/tags/:id', (request, result) => {
    result.send(Template("tags", [request.params.id]));
});

App.get('/applications/:id', (request, result) => {
    result.send(Template("applications", [request.params.id]));
});

App.get('/applications/', (request, result) => {
    result.send(Template("applications", []));
});

App.get('/edit/articles', (request, result) => {
    result.send(Template("back-end", ["articles"]));
});

App.get('/edit/articles/:id', (request, result) => {
    result.send(Template("back-end", ["articles", request.params.id]));
});

App.post('/edit/articles/post/:id', (request, result) => {
    var file = Fs.readFileSync("src/articles.json", 'utf-8');
    file = JSON.parse(file);

    for (var i = 0; i < file.length; i++)
        if (file[i]["id"] === request.body['info']['id']) {
            file[i]["time"] = request.body['info']['time'];
            file[i]["categories"] = request.body['info']['categories'];
            file[i]["tags"] = request.body['info']['tags'];
            file[i]["name"] = request.body['info']['name'];
            file[i]["description"] = request.body['info']["description"];
            Fs.writeFileSync('src/articles/' + request.body['info']['id'] + '.md', request.body['text'], 'utf-8');
            Fs.writeFileSync('src/articles.json', JSON.stringify(file), 'utf-8');
            result.send("POSTED");
            return;
        }

    file.push(request.body['info']);
    Fs.writeFileSync('src/articles.json', JSON.stringify(file, space = 4), 'utf-8');
    Fs.writeFileSync('src/articles/' + request.body['info']['id'] + '.md', request.body['text'], 'utf-8');
    result.send("POSTED");
    return;
});

App.post('/edit/articles/delete/:id', (request, result) => {
    var file = Fs.readFileSync("src/articles.json", 'utf-8');
    file = JSON.parse(file);

    for (var i = 0; i < file.length; i++)
        if (file[i]["id"] === request.params.id) {
            file.splice(i, 1);
            Fs.unlinkSync('src/articles/' + request.params.id + '.md');
            Fs.writeFileSync('src/articles.json', JSON.stringify(file), 'utf-8');
            result.send("POSTED");
            return;
        }

    result.send("POSTED");
});

App.get('/luogu/problem/:id', (request, result) => {
    var id = request.params.id;
});

const axios = require('axios');
const cheerio = require('cheerio');
const TurndownService = require('turndown');

// 示例函数：获取洛谷题目页面的 HTML 并尝试提取题面转换为 Markdown
async function fetchLuoguProblemMarkdown(problemId) {
    const url = `https://www.luogu.com.cn/problem/${problemId}`;
    try {
        // 1. 发送 HTTP 请求获取页面 HTML
        const response = await axios.get(url, {
            headers: {
                // 添加一些基本的请求头，模拟浏览器行为
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36',
            },
            timeout: 10000, // 设置超时时间
        });

        if (response.status !== 200) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const html = response.data;
        // 2. 使用 cheerio 加载 HTML
        const $ = cheerio.load(html);

        // 3. 提取题面主体部分 - 这部分需要根据洛谷实际页面结构调整选择器
        //    下面的选择器是示例，很可能已经过时，你需要自行检查页面结构更新
        const problemContentHtml = $('#problem-content').html(); // 假设题面在一个id为"problem-content"的元素里
        if (!problemContentHtml) {
            throw new Error('Failed to find problem content element in the page.');
        }

        // 4. 初始化 Turndown 服务并配置（可选）
        const turndownService = new TurndownService({
            codeBlockStyle: 'fenced',
            headingStyle: 'atx',
        });

        // 5. 将 HTML 转换为 Markdown
        const markdown = turndownService.turndown(problemContentHtml);

        return markdown;

    } catch (error) {
        console.error('Error fetching or converting the problem:', error.message);
        // 可以根据不同的错误类型进行更细致的处理
        return null;
    }
}

// 使用示例：获取 P1001 的题面 Markdown
const problemId = 'P1001'; // 替换为你想获取的题目ID，例如 P1000
fetchLuoguProblemMarkdown(problemId)
    .then(markdown => {
        if (markdown) {
            console.log(`# ${problemId} 的题面 Markdown:\n`);
            console.log(markdown);
            // 你也可以在这里将 markdown 写入文件或做其他处理
        } else {
            console.log(`Failed to get markdown for ${problemId}.`);
        }
    })
    .catch(err => console.error(err));

var Server = App.listen(3000, () => {
    console.log("Server 3000");
});