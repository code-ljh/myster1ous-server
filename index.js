/*
 * THE ENTRY SCRIPT OF CODELJH'S SERVER
 * INDEX.JS
 */

var Cheerio = require("cheerio");
var Turndown = require("turndown");
var Express = require("express");
var Fs = require('fs');
var Path = require('path');
const TurndownService = require("turndown");
var MainPath = "D://server";
var App = Express();

var Luogu = require("D://server/luogu.js");

var MarkdownIt = require('markdown-it');
var TexMath = require('markdown-it-texmath');
var Katex = require('katex');

const md = MarkdownIt({ html: true }) // 允许 HTML 标签
    .use(TexMath, {
        engine: Katex,
        delimiters: 'dollars'
    });

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
App.use(Express.text({type: 'text/plain', limit: '10mb'}));
App.use(Express.urlencoded({ extended: true }));

function Template(Tabname, List) {
    var FormatList = JSON.stringify(List);
    return (`
        <!DOCTYPE html>
        <body style="background-color:black">
        </body>
        <script type="module">
            import * as template from '/script/template/load.js';
            import * as loadscripts from '/script/template/script.js';
            import * as Main from '/script/main.js';
            loadscripts.LoadScripts();
            template.LoadTemplate(document.body, \`${Tabname}\`);
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

App.get('/applications/:id/:id2', (request, result) => {
    result.send(Template("applications", [request.params.id, request.params.id2]));
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
    Luogu.GetMarkdown(id, (md) => {
        if (!md) {
            result.send("404");
            return 0;
        }
        var filelink = `storage/luogu/problemset/${id}.md`;
        Fs.writeFileSync(filelink, md, 'utf-8');
        result.send(Template("applications", ["luogu", md]));
    });
});

App.post('/api/render', (request, result) => {
    result.send(md.render(request.body));
});

App.get('/api/source', (request, result) => {
    result.send(Fs.readFileSync('index.js', 'utf-8'));
});

App.get('/luogu/compare/:id', (request, result) => {
    Luogu.GetUserPractice(request.params.id, (stuff2, userinfo2) => {
        Luogu.GetUserPractice(528472, (stuff1, userinfo) => {
            try {
                result.send(
                    Template("applications", [
                        "luogu", "compare", 
                        ["myster1ous"].concat(stuff1), 
                        [userinfo2.user.name].concat(stuff2)
                    ])
                );
            } catch {
                result.send(
                    Template("applications", [
                        "luogu", "compare", 
                        ["myster1ous"].concat(stuff1),
                        "list"
                    ])
                );
            }
        });
    });
});

App.get('/luogu/compare', (request, result) => {
    Luogu.GetUserPractice(528472, (stuff1, userinfo) => {
        result.send(
            Template("applications", [
                "luogu", "compare", "list"
            ])
        );
    });
});

var Server = App.listen(3000, () => {
    console.log("Server 3000");
});