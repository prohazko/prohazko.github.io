var fs = require('fs');
var format = require('util').format;

function shadeColor(color, percent) {

    var R = parseInt(color.substring(1, 3), 16);
    var G = parseInt(color.substring(3, 5), 16);
    var B = parseInt(color.substring(5, 7), 16);

    R = parseInt((R * (100 + percent) / 100));
    G = parseInt((G * (100 + percent) / 100));
    B = parseInt((B * (100 + percent) / 100));

    R = (R < 255) ? R : 255;
    G = (G < 255) ? G : 255;
    B = (B < 255) ? B : 255;

    var RR = ((R.toString(16).length == 1) ? "0" + R.toString(16) : R.toString(16));
    var GG = ((G.toString(16).length == 1) ? "0" + G.toString(16) : G.toString(16));
    var BB = ((B.toString(16).length == 1) ? "0" + B.toString(16) : B.toString(16));

    return "#" + RR + GG + BB;
}


function getButtonStyle(model, btn) {

    return format("width: %spx; background-color: %s; border-color:%s",
        model.width,
        btn.color,
        shadeColor(btn.color, -17));
}

function buildButtonsHtml(filepath) {
    var model = require(filepath)

    return (model.categories || []).map(function (cat) {
        return (cat.buttons || []).map(function (btn) {
            return format("<input type='button' class='%s' style='%s' value='%s' />",
                "btn btn-primary",
                getButtonStyle(model, btn),
                btn.title);
        }).map(function (btnhtml, i) {
            var isBreaker = (i + 1) % model.columns != 0;
            return format("<div class='%s'> %s </div>",
                isBreaker ? "pull-left" : '',
                btnhtml);
        }).join('');

    }).join('')
}


function saveModel(filepath, model, cb) {
    fs.writeFile(filepath, JSON.stringify(model), cb);
}


exports.buildButtonsHtml = buildButtonsHtml;
exports.saveModel = saveModel;