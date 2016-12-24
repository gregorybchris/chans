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
    var config;
    var graphics;
    init();

    function init() {
        graphics = new Graphics("#graphics");
        resetConfig();
        setFocus();
        updateDemoText();
    }

    function restartDemo() {
        swal({
                title: "Really?",
                text: "This will restart the demo",
                showCancelButton: true,
                confirmButtonText: "Yes, restart",
            },
            function() {
                graphics.clearAll();
                resetConfig();
                $("#graphics").off("click");
                unbind("p");
                step = 0;
                updateDemoText();
            }
        );
    }

    function resetConfig() {
        config = {
            m: 5,
            points: [],
            groups: [],
            groupHulls: []
        }
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
        $(".explanation-section").fadeOut(100).promise().done(function() {
            $(".explanation-section[data-step='" + step + "']").fadeIn(500);
        });

        // $("#explanation-" + step).show();
        $("#step").html(step);
    }

    function replayStep() {
        swal("Unimplemented", "Sorry, not done yet");
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
            swal("Unimplemented", "Sorry, not done yet");
    }

    function runCreationStep() {
        $("#graphics").on("click", function() {
            graphics.setColor("#AAA");
            graphics.setTransition(250);
            var toAdd = graphics.drawPoint(event.offsetX, event.offsetY);
            config.points.push(toAdd.point);
        });

        hotkeys("p", function(event, handler) {
            graphics.setColor("#AAA");
            graphics.setTransition(250);
            var toAdd = drawRandomPoint();
            config.points.push(toAdd.point);
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
    }

    function endCreationStep(success) {
        if (config.points.length < 10)
            swal("Wait!", "Please add more points before continuing");
        else {
            if (config.points.length > 60)
                graphics.setGlow(false);
            $("#graphics").off("click");
            unbind("p");
            success();
        }
    }

    function runGroupingStep() {
        toggleAnimating();

        var groupColors = ["#1abc9c", "#3498db", "#9b59b6", "#2ecc71",
                            "#f1c40f", "#e67e22", "#e74c3c", "#ecf0f1",
                            "#16a085", "#27ae60", "#2980b9", "#8e44ad",
                            "#f39c12", "#d35400","#c0392b", "#bdc3c7"];



        var groupID = 0;
        var pointID = 0;
        var currentGroup = [];
        function groupPoints(points) {
            var point = points.pop();
            var pointColor = groupColors[Math.floor(pointID / 5) % groupColors.length];
            graphics.setColor(pointColor);
            graphics.setTransition(75);

            var x = point.attr("cx");
            var y = point.attr("cy");

            graphics.remove(point);
            var toAdd = graphics.drawPoint(x, y);
            currentGroup.push(toAdd.point);

            if (pointID % config.m == config.m - 1) {
                groupID++;
                config.groups.push(currentGroup);
                currentGroup = [];
            }
            pointID++;

            toAdd.promise.then(function() {
                if (points.length > 0)
                    groupPoints(points);
            });
        }
        groupPoints(config.points.slice());
        config.groups.push(currentGroup);

        console.log(config.groups);

        toggleAnimating();
    }

    function runGrahamScanStep() {
        toggleAnimating();

        config.groups.forEach(function(group) {
            group.forEach(function(pointA) {
                group.forEach(function(pointB) {
                    var groupColor = pointA.attr("fill");
                    graphics.setColor(groupColor);
                    graphics.setTransition(1000);
                    var xA = pointA.attr("cx");
                    var yA = pointA.attr("cy");
                    var xB = pointB.attr("cx");
                    var yB = pointB.attr("cy");

                    var toAdd = graphics.drawLine(xA, yA, xB, yB);
                });
            });
        });

        toggleAnimating();
    }

    function runJarvisMarchStep() {

    }

    function runCompletedHullStep() {

    }

    function setFocus() {
        hotkeys("left,right,space,r", function(event, handler) { onKeyPress(handler.key); });
        $("#restart-button").on("click", function() { onButtonPress("restart"); });
        $("#replay-button").on("click", function() { onButtonPress("replay"); });
        $("#next-button").on("click", function() { onButtonPress("next"); });
    }

    function onKeyPress(key) {
        if (!animating) {
            if (key == "space")
                nextStep();
            else if (key == "r")
                restartDemo();
        }
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
