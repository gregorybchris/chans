/**
 * Demo Class
 */
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

    /**
     * Acts as a constructor for the Demo class
     */
    function init() {
        graphics = new Graphics("#graphics");
        resetConfig();
        setFocus();
        updateDemoText();
    }

    /**
     * Resets the instatance fields to replay the demo
     */
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

    /**
     * Sets the initial demo configuration values
     */
    function resetConfig() {
        config = {
            m: 5,
            points: [],
            groups: [],
            groupHulls: [],
            groupHullLines: [],
            superHull: [],
            superHullLines: []
        }
    }

    /**
     * Toggles the animating flag to signal whether graphics are animating
     */
    function toggleAnimating() {
        if (animating) {
            $(".nav-button").removeClass("disabled");
        }
        else {
            $(".nav-button").addClass("disabled");
        }
        animating = !animating;
    }

    /**
     * Updates the explanation on the screen associated with a step in the demo
     */
    function updateDemoText() {
        $(".explanation-section").fadeOut(100).promise().done(function() {
            $(".explanation-section[data-step='" + step + "']").fadeIn(500);
        });

        // $("#explanation-" + step).show();
        $("#step").html(step);
    }

    /**
     * Replays a step in the demo
     */
    function replayStep() {
        swal("Unimplemented", "Sorry, not done yet");
    }

    /**
     * Moves to the next step in the demo
     */
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

    /**
     * Runs the point creation step
     */
    function runCreationStep() {
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
            return graphics.putPoint(x, y);
        }

        graphics.setColor("#AAA");
        graphics.setTransition(250);

        $("#graphics").on("click", function() {
            var point = graphics.putPoint(event.offsetX, event.offsetY);
            config.points.push(point);
        });

        hotkeys("p", function(event, handler) {
            var point = drawRandomPoint();
            config.points.push(point);
        });
    }

    /**
     * Runs after the creation step is complete to see if there are enough points
     */
    function endCreationStep(success) {
        if (config.points.length < 10)
            swal("Wait!", "Please add more points before continuing");
        else {
            $("#graphics").off("click");
            unbind("p");
            success();
            console.log(config);
        }
    }

    /**
     * Runs the point grouping step
     */
    function runGroupingStep() {
        var groupColors = ["#1abc9c", "#3498db", "#9b59b6", "#2ecc71",
                            "#f1c40f", "#e67e22", "#e74c3c",
                            "#16a085", "#27ae60", "#2980b9", "#8e44ad",
                            "#f39c12", "#d35400","#c0392b"];

        toggleAnimating();
        var currentGroup = [];
        config.points.forEach(function(point) {
            //TODO: Change if delay to 100

            // Erase old, ungrouped point
            graphics.setTransition(0);
            if (currentGroup.length == config.m - 1)
                graphics.setDelay(0);
            else
                graphics.setDelay(0);
            graphics.erasePoint(point);

            // Get the group color
            var groupID = config.groups.length;
            var pointColor = groupColors[groupID % groupColors.length];
            graphics.setColor(pointColor);

            // Add the new, grouped point
            graphics.setDelay(0);
            graphics.setTransition(0);
            var x = point.getX();
            var y = point.getY();
            var coloredPoint = graphics.drawPoint(x, y);
            currentGroup.push(coloredPoint);

            // Change groups when group is filled
            if (currentGroup.length == config.m) {
                config.groups.push(currentGroup);
                currentGroup = [];
            }
        }, currentGroup);
        if (currentGroup.length != 0)
            config.groups.push(currentGroup);
        graphics.whenDone(toggleAnimating);
    }

    /**
     * Returns 1 for a left turn, -1 for right, and 0 for straight
     */
    function turn(p1, p2, p3) {
        var x1 = p1.getX(), x2 = p2.getX(), x3 = p3.getX();
        var y1 = p1.getY(), y2 = p2.getY(), y3 = p3.getY();
        var v = (x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1);
        if (v > 0) return 1;
        else if (v < 0) return -1;
        else return 0;
    }

    /**
     * Returns the square of the distance between two D3 points
     */
    function sqDist(p1, p2) {
        var x1 = p1.getX(), x2 = p2.getX();
        var y1 = p1.getY(), y2 = p2.getY();
        return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
    }

    /**
     * Runs the Graham Scan step
     */
    function runGrahamScanStep() {
        toggleAnimating();

        // Make copy groups of points
        var newGroups = config.groups.map(function(group) {
            return group.slice();
        });

        // Run Graham Scan on each group
        newGroups.forEach(function(group) {
            if (group.length == 1) {
                config.groupHulls.push(group);
                config.groupHullLines.push([]);
                return;
            }
            //Find the point with minimum x value
            var groupXSorted = group.sort(function(p1, p2) {
                return p1.getX() > p2.getX() ? 1 : -1;
            });
            var minPoint = groupXSorted.shift();

            // Sort all points radially from the minimum x point
            var groupPolarSorted = groupXSorted.sort(function(p1, p2) {
                var turnVal = turn(minPoint, p1, p2);
                if (turnVal == 0)
                    return sqDist(minPoint, p1) > sqDist(minPoint, p2) ? 1 : -1;
                else
                    return turnVal;
            });

            var groupColor = minPoint.getColor();
            graphics.setColor(groupColor);
            //TODO: set transition back to 75
            graphics.setTransition(0);

            var lineStack = [];
            var pointStack = [];
            pointStack.push(minPoint);
            var firstPolarSorted = groupPolarSorted.shift();
            pointStack.push(firstPolarSorted);
            graphics.setDelay(100);
            graphics.setStroke(3);
            var firstLine = graphics.drawLineFromPoints(minPoint, firstPolarSorted);
            lineStack.push(firstLine);
            groupPolarSorted.push(minPoint);
            graphics.setDelay(0);

            // Wrap around the group to find the convex hull
            for (var pointIndex = 0; pointIndex < groupPolarSorted.length; pointIndex++) {
                var point = groupPolarSorted[pointIndex];
                // Remove enough points from the hull to maintain convexity
                var turnVal = 1;
                while (turnVal > 0 && pointStack.length >= 2) {
                    var p1 = pointStack[pointStack.length - 2];
                    var p2 = pointStack[pointStack.length - 1];
                    turnVal = turn(p1, p2, point);
                    if (turnVal > 0) {
                        var oldPoint = pointStack.pop();
                        var oldLine = lineStack.pop();
                        graphics.eraseLine(oldLine);
                    }
                }
                // Add the line for the current point
                var lastPoint = pointStack[pointStack.length - 1];
                var nextLine = graphics.drawLineFromPoints(lastPoint, point);
                lineStack.push(nextLine);
                pointStack.push(point);
            }

            // Add the points (and lines) remaining in the stack to the list of hulls
            pointStack.pop();
            config.groupHulls.push(pointStack);
            config.groupHullLines.push(lineStack);
        });
        graphics.whenDone(toggleAnimating);
    }

    /**
     * Runs the Jarvis March step
     */
    function runJarvisMarchStep() {
        toggleAnimating();
        // Make a copy of the group hulls to work with
        var newHulls = config.groupHulls.map(function(hull) {
            return hull.slice();
        });

        // Find the x-minimum point from all hulls and it's hull
        var leftHullIndex = 0;
        var leftPointIndex = 0;
        for (var hullIndex = 0; hullIndex < newHulls.length; hullIndex++) {
            var hull = newHulls[hullIndex];
            for (var hullPointIndex = 0; hullPointIndex < hull.length; hullPointIndex++) {
                var hullPoint = hull[hullPointIndex];
                var leftHullPoint = newHulls[leftHullIndex][leftPointIndex];
                if (hullPoint.getX() < leftHullPoint.getX()) {
                    leftHullIndex = hullIndex;
                    leftPointIndex = hullPointIndex;
                }
            }
        }

        graphics.setColor("#FFF");
        graphics.setStroke(3);
        //TODO: reset transition to 100
        graphics.setTransition(50);
        graphics.setDelay(0);

        var superHullPoints = [];
        var superHullLines = [];
        var currentHullIndex = leftHullIndex;
        var currentPointIndex = leftPointIndex;
        var foundFullHull = false;

        // Perform up to m giftwrapping iterations
        // while (superHullPoints.length < config.m && !foundFullHull) {
        // while (superHullPoints.length < config.m && !foundFullHull) {
            var currentPoint = newHulls[currentHullIndex][currentPointIndex];
            var nextTangentHullIndex = 0;
            var nextTangentPointIndex = 0;
            var nextTangentLine;

            // Calculate tangents to each of the group hulls that do not contain
            //  the current point from which we are searching
            newHulls.forEach(function(hull, hullIndex) {
                // Redefine modulus to always return positive
                function mod(x, y) {
                    return ((x % y) + y) % y;
                }

                // Skip over current group hull
                if (hullIndex != currentHullIndex) {
                    var startIndex = 0;
                    var endIndex = hull.length;
                    var tangentPointIndex;

                    var turnStartPrev = turn(currentPoint, hull[startIndex], hull[endIndex - 1]);
                    var turnStartNext = turn(currentPoint, hull[startIndex], hull[mod(1, endIndex)]);
                    // Binary search on group convex hull for the tangent point
                    var count = 0;
                    while (startIndex < endIndex) {
                        count++;
                        if (count > 10)
                            break;
                        tangentPointIndex = Math.floor((startIndex + endIndex) / 2);
                        var tangentPoint = hull[tangentPointIndex];
                        var prevPoint = hull[mod(tangentPointIndex - 1, hull.length)];
                        var nextPoint = hull[mod(tangentPointIndex + 1, hull.length)];
                        var turnTangent = turn(currentPoint, hull[startIndex], tangentPoint);
                        var turnPrev = turn(currentPoint, tangentPoint, prevPoint);
                        var turnNext = turn(currentPoint, tangentPoint, nextPoint);

                        var tangentLine = graphics.drawLineFromPoints(currentPoint, tangentPoint);

                        if (turnPrev <= 0 && turnNext <= 0) {
                            break;
                        }
                        else if ((turnTangent < 0 &&
                            (turnStartNext > 0 || turnStartPrev == turnStartNext)) ||
                            (turnTangent > 0 && turnPrev > 0)) {
                            endIndex = tangentPointIndex;
                            graphics.eraseLine(tangentLine);
                        }
                        else {
                            startIndex = tangentPointIndex + 1;
                            turnStartPrev = -1 * turnNext;
                            turnStartNext = turn(currentPoint, hull[startIndex], hull[mod(startIndex + 1, hull.length)]);
                            graphics.eraseLine(tangentLine);
                        }
                    }

                    var tangentPoint = hull[tangentPointIndex];
                    // var tangentLine = graphics.drawLineFromPoints(currentPoint, tangentPoint);



                    //TODO: We've found a tangent point
                    //  add the point and line to our lists
                }
            });

            //TODO: Find the furthest right tangent compared to currentPointIndex
            //          delete all other lines
        // }

        graphics.whenDone(toggleAnimating);
    }

    /**
     * Runs the step that completes the convex hull with Jarvis March
     */
    function runCompletedHullStep() {

    }

    /**
     * Adds key and mouse listeners to the screen
     */
    function setFocus() {
        hotkeys("space,r", function(event, handler) { onKeyPress(handler.key); });
        $("#restart-button").on("click", function() { onButtonPress("restart"); });
        $("#replay-button").on("click", function() { onButtonPress("replay"); });
        $("#next-button").on("click", function() { onButtonPress("next"); });
    }

    /**
     * Handles key press events
     */
    function onKeyPress(key) {
        if (!animating) {
            if (key == "space")
                nextStep();
            else if (key == "r")
                restartDemo();
        }
    }

    /**
     * Handles button press events
     */
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

// Creates a new demo and runs it
var demo = new Demo();
