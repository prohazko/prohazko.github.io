var express = require('express');
var routes = require('./routes');
var path = require('path');

var port = process.env.PORT || 5000;
var addr = 'http://' + (process.env.LOCALHOST || 'localhost') + ':' + port + '/';
var dir  = path.dirname(require.main.filename);

function filepath(req, resp, next) {
    req.filepath = function (rest) {
        return path.join(dir, rest);
    };
    next();
}

express()
  .set('dir', dir)
  .set('addr', addr)
  .use(filepath)
  .use(express.static(path.join(dir, 'assets')))
  .use(express.static(path.join(dir, './../assets')))
  .get('/', routes.index)
  .get('/shot', routes.webshot.make)
  .get('/webshot.html', routes.webshot.index)
  .listen(+port);
  
console.log(addr, 'started!')