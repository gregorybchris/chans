var Demo = function() {
    var WELCOME_STEP = 0;
    var CREATION_STEP = 1;
    var GROUPING_STEP = 2;
    var GRAHAM_SCAN_STEP = 3;
    var JARVIS_MARCH_STEP = 4;
    var COMPLETED_HULL_STEP = 5;

    var lastStep = 5;
    var step = 0;
    var animating = false;
    var points = [];
    var graphics;
    init();

    function init() {
        graphics = new Graphics("#graphics");
        setFocus();
        updateDemoText();
    }

    function restartDemo() {
        graphics.clearAll();
        step = 0;
        points = [];
        $("#graphics").off("click");
        unbind("r");
        updateDemoText();
    }

    function toggleAnimating() {
        if (animating) {
            $(".nav-button").removeClass("disabled");
        }
        else {
            $(".nav-button").addClass("disabled");
        }
        animating = !animating;
    }

    function updateDemoText() {
        $(".explanation-section").hide();
        $("#explanation-" + step).show();
        $("#step").html(step);
    }

    function replayStep() {
        alert("Unimplemented");
    }

    function nextStep() {
        function moveOn(stepRunner) {
            step++;
            updateDemoText();
            stepRunner();
        }

        if (step == WELCOME_STEP)
            moveOn(runCreationStep);
        else if (step == CREATION_STEP)
            endCreationStep(function() { moveOn(runGroupingStep) });
        else if (step == GROUPING_STEP)
            moveOn(runGrahamScanStep);
        else if (step == GRAHAM_SCAN_STEP)
            moveOn(runJarvisMarchStep);
        else if (step == JARVIS_MARCH_STEP)
            moveOn(runCompletedHullStep);
        else if (step == COMPLETED_HULL_STEP)
            alert("Unimplemented")
    }

    function runCreationStep() {
        $("#graphics").on("click", function() {
            points.push(graphics.drawPoint(event.offsetX, event.offsetY));
        });

        function drawRandomPoint() {
            function crand(min, max, bias, influence) {
                var rnd = Math.random() * (max - min) + min;
                var mix = Math.random() * influence;
                return rnd * (1 - mix) + bias * mix;
            }

            var width = graphics.getWidth();
            var height = graphics.getHeight();
            var influence = .7;
            var xBias = width / 2, yBias = height / 2;
            var xMin = width * .05, xMax = width - xMin;
            var yMin = height * .05, yMax = height - yMin;
            var x = crand(xMin, xMax, xBias, influence)
            var y = crand(yMin, yMax, yBias, influence)
            return graphics.drawPoint(x, y);
        }

        hotkeys("r", function(event, handler) { points.push(drawRandomPoint()); });

    }

    function endCreationStep(success) {
        if (points.length < 10)
            alert("Please Add More Points :(");
        else {
            $("#graphics").off("click");
            unbind("r");
            success();
        }
    }

    function runGroupingStep() {

    }

    function runGrahamScanStep() {

    }

    function runJarvisMarchStep() {

    }

    function runCompletedHullStep() {

    }

    function setFocus() {
        hotkeys("left,right,enter,esc", function(event, handler) { onKeyPress(handler.key); });
        $("#restart-button").on("click", function() { onButtonPress("restart"); });
        $("#replay-button").on("click", function() { onButtonPress("replay"); });
        $("#next-button").on("click", function() { onButtonPress("next"); });
    }

    function onKeyPress(key) {
        if (key == "enter")
            nextStep();
        else if (key == "esc")
            restartDemo();
    }

    function onButtonPress(button) {
        if (!animating) {
            if (button == "restart")
                restartDemo();
            else if (button == "replay")
                replayStep();
            else if (button == "next")
                nextStep();
        }
    }
}

var demo = new Demo();


// function initListeners() {
//     hotkeys("left,right,enter,space,esc", function(event, handler) {
//         var c = handler.key;
//         if (c == "enter" || c == "space" || c == "right")
//             nextStep();
//         else if (c == "left")
//             graphics.addRandomPoint();
//         else if (c == "esc")
//             restart();
//     });
//
//     hotkeys("l", function(event, handler) {
//         var c = handler.key;
//         if (c == "l")
//             graphics.addLine(50, 50, 10, 10);
//     });
//
//     $("#restart-button").on("click", function() {
//         restart();
//     });
//
//     $("#replay-button").on("click", function() {
//         replayStep();
//     });
//
//     $("#next-button").on("click", function() {
//         nextStep();
//     });
// }
//
// function initDemo() {
//     updateExplanation();
// }
//
// function updateExplanation() {
//     $(".explanation-section").hide();
//     $("#explanation-" + step).show();
// }
//
// function updateStepCounter() {
//     $("#step").html(step);
// }
//
// function restart() {
//     graphics.clearAll();
//     goToStep(0);
// }
//
// function replayStep() {
//     alert("REPLAY");
// }
//
// function goToStep(step) {
//     if (!animating && step <= totalSteps) {
//         this.step = step;
//         updateStepCounter();
//         updateExplanation();
//     }
// }
//
// function nextStep() {
//     goToStep(step + 1);
// }
//
// $("#graphics").on("click", function() {
//     graphics.addPoint(event.offsetX, event.offsetY);
// });
