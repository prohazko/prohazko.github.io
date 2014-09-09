/*
 0  | a_0
 1  | a_1x + a_0
 2  | a_2x^2 + a_1x + a_0
 3  | a_3x^3 + a_2x^2 + a_1x + a_0
   ...
 n  | a_nx^n + a_(n-1)x^(n-1) + ... + a_2x^2 + a_1x + a_0   
*/


function polyHtml(degree, as){
    //a_3x^3 + a_2x^2 + a_1x + a_0
    var parts = []
    for (var i = degree; i >= 0; i--) {
        var a = " a<sub>" + i + "</sub>";
        if(as) a = as[i];
        parts.push( a + "x<sup>" + i + "</sup> ")
    }
    return parts.join(" + ")
}


function poly(x, degree, as) {
    if (degree < 0) throw 'invalid argument: as';
    //  if (degree > as.length) throw 'invalid argument: as';

    var y = 0;
    for (var i = 0; i <= degree; i++) {
        y += (as[i] ) * Math.pow(x, i);
    }
    return y;
}


var options = {
    degree: 3,
    min: -2,
    max: 2,
    step: 0.1,
    factors: [1, 1, 1, 1]
}

var plotOptions = {
    series: {
        lines: {
            show: true
        },
        points: {
            show: true
        }
    },
    grid: {
        hoverable: true,
        clickable: true
    },
    zoom: {
        interactive: true
    },
    pan: {
        interactive: true
    }
};

function render() {
    var poly1 = [];
    for (var x = options.min; x <= options.max; x += options.step) {
        poly1.push([x, poly(x, options.degree, options.factors)]);
    }

    $.plot("#canvas", [{
        data: poly1,
        lines: { show: true, fill: true }
    }], plotOptions);

    $('#poly-view').html(polyHtml(options.degree));
    $('#poly-view-factors').html(polyHtml(options.degree, options.factors));
}

function readOptions() {
    options.degree = +$('#poly-degree').val();
    options.min = +$('#poly-min').val();
    options.max = +$('#poly-max').val();
    options.step = +$('#poly-step').val();

    render();
    saveOptions();
}

function readFactors() {
    var factors = []
    for (var n = 0; n <= options.degree; n++) {
        factors.push( +$('#poly-factor-' + n).val() )
    }
    options.factors = factors;
    render();
    saveOptions();
}

function createFactorInputs() {
    $('.poly-factor').remove();
    for (var n = 0; n <= options.degree; n++) {

        var $input = $('<input>').attr('type', 'number')
            .attr('id', 'poly-factor-' + n)
            .attr('step', '0.1')
            .change(readFactors)
            .val(options.factors[n] || 1)

        $('<label>').text('a' + n)
            .addClass('poly-factor')
            .css('display', 'block')
            .append($input)
            .insertBefore('#poly-factor-sep')
    }
}

function bindTooltip() {
    var $tooltip = $("<div>")
        .attr('id', 'tooltip')
        .css({
            position: "absolute",
            display: "none",
            border: "1px solid #fdd",
            padding: "2px",
            "background-color": "#fee",
            opacity: 0.80
        }).appendTo("body");

    $("#canvas").bind("plothover", function (event, pos, item) {
        if (!item) return $tooltip.hide();
        var x = item.datapoint[0].toFixed(2),
            y = item.datapoint[1].toFixed(2);

        $tooltip.html("f(" + x + ") = " + y)
            .css({ top: item.pageY + 5, left: item.pageX + 5 })
            .fadeIn(200);
    });
}


function saveOptions() {
  localStorage.setItem('plot-options', JSON.stringify(options))
}

function loadOptions() {
    var opts = localStorage.getItem('plot-options');
    if (opts) {
        options = JSON.parse(opts)
    }
    $('#poly-degree').val(options.degree);
    $('#poly-min').val(options.min);
    $('#poly-max').val(options.max);
    $('#poly-step').val(options.step);

    createFactorInputs();
}

$(function () {

    loadOptions();
    render();
    bindTooltip();
    createFactorInputs();

    $('#poly-degree').change(function () {
        readOptions();
        createFactorInputs();
        readFactors();
    });
    $('#poly-min').change(readOptions);
    $('#poly-max').change(readOptions);
    $('#poly-step').change(readOptions);
})