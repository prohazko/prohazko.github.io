var http = require("http"),
    async = require("async"),
    url = require("url"),
    concat = require("path").join,
    fs = require("fs")
    port = process.env.PORT || 5000;





function indexShot(appdir, eq, resp) {
    var webshot = require('webshot');
    var query = url.parse(req.url, true).query;
    var name = query.name || 'unknown';

    var config = require(concat(appdir, 'abtn.json'));
    
    console.log();
}
