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

function ReadHTML(path) {
    var data = Fs.readFileSync(path, 'utf-8');
    console.log(path, data);
    return data;
}

App.use(Express.static('.'));

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
            import * as Main from '/script/main.js';
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

var Server = App.listen(3000, () => {
    console.log("Server 3000");
    console.log('http://180.110.111.159:3000');
});