var fs = require('fs');
var webshot = require('webshot');

exports.index = function shotIndex(req, resp) {
    resp.sendFile(req.filepath('views/webshot.html'));
};

exports.make = function shotMake(req, resp) {
    var name = req.query.name || 'unknown';
    var addr = req.app.get('addr') + 'webshot.html';
    
    var offset = { top: +req.query.top, left: +req.query.left };
    var size = { width: +req.query.width, height: +req.query.height };
    var options = { siteType: 'url', renderDelay: 50, shotOffset: offset, shotSize: size };

    webshot(addr, options, function (err, render) {
        var path = req.filepath('buttons/' + name + '.png');
        var file = fs.createWriteStream(path, { encoding: 'binary' });

        render.pipe(resp);
        render.pipe(file);
    });
};