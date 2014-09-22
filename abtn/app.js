var http = require("http"),
    url = require("url"),
    concat = require("path").join,
    fs = require("fs")
    port = process.env.PORT || 5000;

var addr = 'http://' + (process.env.LOCALHOST || 'localhost' )+ ':' + port + '/';
var appdir = require("path").dirname(require.main.filename);

function sendFile(name, resp) {
    fs.readFile(concat(appdir, name), "binary", function (err, file) {
        if (err) {
            resp.writeHead(500, { "Content-Type": "text/plain" });
            resp.end('error');
            return;
        }

        resp.writeHead(200);
        resp.write(file);
        resp.end();
    });
}

function hasExtension(path, ext) {
    return path.indexOf(ext) == path.length - ext.length;
}

function makeShot(req, resp) {
    var webshot = require('webshot');
    var query = url.parse(req.url, true).query;
    var name = query.name || 'unknown';

    console.log(query);

    var offset = { top: +query.top, left: +query.left };
    var size = { width: +query.width, height: +query.height };
    var options = { siteType: 'url', renderDelay: 50, shotOffset : offset, shotSize:size };

    webshot(addr, options, function (err, renderStream) {
        var file = fs.createWriteStream(concat(appdir ,'buttons/',  name+'.png'), { encoding: 'binary' });
        console.log(err);
        renderStream.pipe(resp);
        renderStream.pipe(file);
    });

}

http.createServer(function (req, resp) {
    var path = url.parse(req.url).pathname;
    var file = '.' + path;

    if (path == '/' || path == '/index.html')
        return sendFile("index.html", resp);

    var resource = hasExtension(path, '.js') || hasExtension(path, '.css') || hasExtension(path, '.json');
    if (resource && fs.existsSync(concat(appdir, file)) && path != '/app.js')
        return sendFile(file, resp);

    if (path == '/shot.png')
        return makeShot(req, resp);

    resp.writeHead(404, { "Content-Type": "text/plain" });
    resp.end('not found');
    console.log(url.parse(req.url))

}).listen(+port);

console.log("start");
