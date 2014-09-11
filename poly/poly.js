

/*

         Этот код был написан не мной - 
                
              он был написан демонами

 
*/


function throttle(fn, timeout, ctx) {
    var timer, args, needInvoke;
    return function() {
        args = arguments;
        needInvoke = true;
        ctx = ctx || this;
        if(!timer) {
            (function() {
                if(needInvoke) {
                    fn.apply(ctx, args);
                    needInvoke = false;
                    timer = setTimeout(arguments.callee, timeout);
                }
                else {
                    timer = null;
                }
            })();
        }
    };
}

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
    min: -4,
    max: 4,
    step: 1,
    factors: [1, 1, 1, 1]
}
var options_bckp = $.extend({}, options)

var plotOptions = {
    xaxis : {
        tickSize : 1
    },

    series: {
        lines: {
            zero : true,
            fill : false,
            show: true
        },
        bars : {
          fill : false
        },
        points: {
            show: true
        }
    },
    grid: {
        hoverable: true,
        clickable: true,
        markings: [ { yaxis: { from: 0, to: 0 },   color : '#a1a1a1' }, 
                    { xaxis: { from: 0, to: 0 },   color : '#a1a1a1' }]
    },
    zoom: {
        interactive: true
    },
    pan: {
        interactive: true
    },
    
};

function render() {
    var poly1 = [];
    $('.poly-table').remove();
    for (var x = options.min; x <= options.max; x += options.step) {
        var fx = poly(x, options.degree, options.factors)
        poly1.push([x, fx]);
        
        $('<td>').text(x).addClass('poly-table').insertAfter('#poly-x')
        $('<td>').text(fx.toFixed(2)).addClass('poly-table').insertAfter('#poly-fx')
    }

    $.plot("#canvas", [{
        data: poly1,
        lines: { show: true, fill: false }
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

        $('<label>').html('a<sub>' + n + '</sub>')
            .addClass('poly-factor')
            .css('display', 'block')
            .append($input)
            .insertBefore('#poly-factor-sep')
    }
}

function bindEvents() {
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
    
    $("#canvas").bind("plotpan plotzoom",throttle( function(e, plot){
       var xaxis = plot.getAxes().xaxis;
       var frac = options.step.toString().split('.')[1];
       frac = (frac && frac.length) || 0;
       $('#poly-min').val(+ xaxis.min.toFixed(frac));
       $('#poly-max').val(+ xaxis.max.toFixed(frac));
       readOptions();
    }, 500))
    
    $("#stahp-the-madness").click(function(){
       localStorage.setItem('plot-options', JSON.stringify(options_bckp));
       loadOptions();
       render();
    });
}


function saveOptions() {
  localStorage.setItem('plot-options', JSON.stringify(options))
}

function loadOptions() {
    var opts = localStorage.getItem('plot-options');
    if (opts) {
        options = JSON.parse(opts);
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
    bindEvents();
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
