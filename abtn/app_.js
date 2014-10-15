var http = require("http"),
    async = require("async"),
    url = require("url"),
    concat = require("path").join,
    fs = require("fs")
    port = process.env.PORT || 5000;

var addr = 'http://' + (process.env.LOCALHOST || 'localhost' )+ ':' + port + '/';
var appdir = require("path").dirname(require.main.filename);

function sendError(resp) {
    resp.writeHead(500, { "Content-Type": "text/plain" });
    resp.end('error');
}

function sendFile(name, resp) {
    fs.createReadStream(concat(appdir, name)).pipe(resp);
}

function sendButtonsZip(req, resp) {
    var packer = require('zip-stream');
    var archive = new packer(); // OR new packer(options)

    archive.on('error', function(err) {
        sendError(resp);
    });


    archive.pipe(resp);

    var buttonsDir = concat(appdir, 'buttons');
    fs.readdir(buttonsDir, function (err, dir) {
        async.mapSeries(dir, function (pic, cb) {
            var file = fs.createReadStream( concat(buttonsDir, pic) ); 
            archive.entry(file, { name: pic }, cb);
        }, function (err, paths) {
            if (err) {
                console.log(err)
            }
            archive.finish();
        })
    })

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

    webshot(addr + '/index_webshot.html', options, function (err, renderStream) {
        var file = fs.createWriteStream(concat(appdir, 'buttons/',  name+'.png'), { encoding: 'binary' });
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

    if (path == '/' || path == '/index_webshot.html')
        return sendFile("index_webshot.html", resp);

    var resource = hasExtension(path, '.js') || hasExtension(path, '.css') || hasExtension(path, '.json');
    if(path.indexOf('assets/') >= 0){
        file = './../' + file;
    }

    if (resource && fs.existsSync(concat(appdir, file)) && path != '/app.js')
        return sendFile(file, resp);

    if (path == '/shot.png')
        return makeShot(req, resp);

    if (path == '/buttons.zip')
        return sendButtonsZip(req, resp);

    resp.writeHead(404, { "Content-Type": "text/plain" });
    resp.end('not found');
    console.log(url.parse(req.url))

}).listen(+port);

console.log("start");
console.log("this code is complete mess");
console.log("TODO: rewrite it using express")
