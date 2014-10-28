var fs = require('fs');
var webshot = require('webshot');
var format = require('util').format;
var abtn = require('./abtn');

exports.index = function shotIndex(req, resp) {
    var filepath = req.filepath('views/webshot.html');

    fs.readFile(filepath, function (err, content) {
        var html = abtn.buildButtonsHtml(req.filepath('assets/abtn.json'));
        content = content.toString('utf-8').replace('{{buttons}}', html);
        resp.send(content);
    });

    //resp.sendFile();
};

exports.save = function saveModel(req, resp) {
    var filepath = req.filepath('views/webshot.html');
    var model = req.body;

    console.log(req.body);
    resp.send({fucks:0});
    return;

    abtn.saveModel(filepath, model, function (err) {
        resp.send({ ok: !!err })
    })
}

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