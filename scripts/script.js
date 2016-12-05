var M_INIT = 5;

var points = [];
var totalSteps = 10;
var step = 0;
var animating = false;

/**
 * Graphics object
 */
var Graphics = function() {
    var svg;
    init();

    function init() {
        svg = d3.select("#graphics")
            .attr("class", "graphics-svg");

        var defs = svg.append("defs");
        var filter = defs.append("filter")
            .attr("id","glow");
        filter.append("feGaussianBlur")
            .attr("stdDeviation","1.5")
            .attr("result","coloredBlur");
        var feMerge = filter.append("feMerge");
        feMerge.append("feMergeNode")
            .attr("in","coloredBlur");
        feMerge.append("feMergeNode")
            .attr("in","SourceGraphic");
    }

    // Taken from K3N on StackOverflow
    function crand(min, max, bias, influence) {
        var rnd = Math.random() * (max - min) + min;
        var mix = Math.random() * influence;
        return rnd * (1 - mix) + bias * mix;
    }

    this.addPoint = function(x, y) {
        var point = svg.append("circle")
            .attr("class", "point")
            .attr("cx", x).attr("cy", y).attr("r", 0)
            .attr("fill", "#999")
            .style("filter", "url(#glow)");
        Velocity(point.node(), { r: 6 }, { duration: 250 }, "easeInSine");
        return point;
    }

    this.addLine = function(x1, y1, x2, y2) {
        var line = svg.append("line")
            .attr("class", "edge")
            .attr("x1", x1).attr("y1", y1)
            .attr("x2", x1).attr("y2", y1)
            .attr("stroke", "#55F").attr("stroke-width", "2")
            .style("filter", "url(#glow)");
        Velocity(line.node(), { x2: 200, y2: 200 }, { duration: 500 }, "easeInSine");
        return line;
    }

    this.addRandomPoint = function() {
        var width = svg.style("width").replace("px", "");
        var height = svg.style("height").replace("px", "");
        var influence = .7;
        var xBias = width / 2, yBias = height / 2;
        var xMin = width * .05, xMax = width - xMin;
        var yMin = height * .05, yMax = height - yMin;
        var x = crand(xMin, xMax, xBias, influence)
        var y = crand(yMin, yMax, yBias, influence)
        return this.addPoint(x, y);
    }

    this.clear = function() {
        svg.selectAll("circle").remove();
        svg.selectAll("line").remove();
    }
}

var Demo = function() {

}

var graphics = new Graphics();
initListeners();
initDemo();

function initListeners() {
    hotkeys("left,right,enter,space,esc", function(event, handler) {
        var c = handler.key;
        if (c == "enter" || c == "space" || c == "right")
            nextStep();
        else if (c == "left")
            graphics.addRandomPoint();
        else if (c == "esc")
            restart();
    });

    hotkeys("l", function(event, handler) {
        var c = handler.key;
        if (c == "l")
            graphics.addLine(50, 50, 10, 10);
    });

    $("#restart-button").on("click", function() {
        restart();
    });

    $("#replay-button").on("click", function() {
        replayStep();
    });

    $("#next-button").on("click", function() {
        nextStep();
    });
}

function initDemo() {
    updateExplanation();
}

function updateExplanation() {
    $(".explanation-section").hide();
    $("#explanation-" + step).show();
}

function updateStepCounter() {
    $("#step").html(step);
}

function restart() {
    graphics.clear();
    goToStep(0);
}

function replayStep() {
    alert("REPLAY");
}

function goToStep(step) {
    if (!animating && step <= totalSteps) {
        this.step = step;
        updateStepCounter();
        updateExplanation();
    }
}

function nextStep() {
    goToStep(step + 1);
}

$("#graphics").on("click", function() {
    graphics.addPoint(event.offsetX, event.offsetY);
});

// $("circle.point").each(function() {
//     Velocity($(this), { r: 6, fill: "#999" }, { duration: 250 }, "easeInSine");
// })

// var jsonCircles = [
//      { "x": 150, "y": 150, "r": 8 },
//      { "x": 70, "y": 70, "r": 8 },
//      { "x": 110, "y": 100, "r": 8 }];
//
// var circles = svg.selectAll("circle")
//     .data(jsonCircles)
//     .enter()
//     .append("circle");
