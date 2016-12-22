var M_INIT = 5;

var points = [];
var totalSteps = 10;
var step = 0;
var animating = false;

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
