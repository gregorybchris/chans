/**
 * Graphics Class
 */
var Graphics = function(svgID) {
    var settings = {
        color: "#000",
        pointSize: 6,
        stroke: 3,
        transition: 250,
        delay: 0
    }
    var svg;
    var queue;
    init();

    /**
     * Acts as a constructor for the Graphics class
     */
    function init() {
        svg = d3.select(svgID);
        setupTypes();
        initializeEventQueue();
    }

    /**
     * Creates two groupings for SVG lines and points (circles)
     *  This enables two layers to be drawn, points over lines
     */
    function setupTypes() {
        svg.append("g").attr("id", "lines");
        svg.append("g").attr("id", "points");
    }

    /**
     * Gives a point object methods to get X and Y coordinates
     */
    function giveGetters(point) {
        point.getX = function() {
            return parseFloat(this.attr("cx"));
        }

        point.getY = function() {
            return parseFloat(this.attr("cy"));
        }

        point.getColor = function() {
            return this.attr("fill");
        }
    }

    /**
     * Initializes the process queue with a new, empty queue
     */
     function initializeEventQueue() {
         queue = new Queue();
     }

     /**
      * Starts the next process on the queue
      */
     function startNextProcess() {
         if (!queue.isEmpty()) {
             var proc = queue.peek();
             var promise = proc();
             promise.then(function() {
                 queue.dequeue();
                 startNextProcess();
             });
         }
     }

    /**
     * Adds a process to the process queue
     */
    function enqueueProcess(proc) {
        queue.enqueue(proc);
        if (queue.getLength() == 1)
            startNextProcess();
    }

    /**
     * Adds a user-defined process to the process queue
     */
    this.whenDone = function(proc) {
        function process() {
            proc();
            return new Promise(function(resolve, reject) { resolve(); });
        }
        enqueueProcess(process);
    }

    /**
     * Draws a point to the SVG
     */
    this.drawPoint = function(x, y) {
        var point = svg.select("#points").append("circle")
            .attr("class", "point")
            .attr("cx", x).attr("cy", y).attr("r", 0)
            .attr("fill", settings.color);

        var transition = settings.transition;
        var delay = settings.delay;
        var pointSize = settings.pointSize;
        function animateProcess() {
            var promise = Velocity(point.node(), {
                r: pointSize
            }, {
                delay: delay,
                duration: transition
            }, "easeInSine");
            return promise;
        }
        enqueueProcess(animateProcess);
        giveGetters(point);
        return point;
    }

    /**
     * Puts a point on the SVG without queueing the animation
     */
    this.putPoint = function(x, y) {
        var point = svg.select("#points").append("circle")
            .attr("class", "point")
            .attr("cx", x).attr("cy", y).attr("r", 0)
            .attr("fill", settings.color);

        var promise = Velocity(point.node(), {
            r: settings.pointSize
        }, {
            duration: settings.transition
        }, "easeInSine");
        giveGetters(point);
        return point;
    }

    /**
     * Draws a line to the SVG
     */
    this.drawLine = function(x1, y1, x2, y2) {
        var line = svg.select("#lines").append("line")
            .attr("class", "edge")
            .attr("x1", x1).attr("y1", y1)
            .attr("x2", x1).attr("y2", y1)
            .attr("stroke", settings.color)
            .attr("stroke-width", 0);

        var transition = settings.transition;
        var stroke = settings.stroke;
        var delay = settings.delay;
        function animateProcess() {
            var promise = Velocity(line.node(), {
                x2: x2,
                y2: y2,
                strokeWidth: stroke
            }, {
                delay: delay,
                duration: transition
            }, "easeInSine");
            return promise;
        }
        enqueueProcess(animateProcess);
        return line;
    }

    /**
     * Draws a line to the SVG
     */
    this.drawLineFromPoints = function(p1, p2) {
        var x1 = p1.attr("cx"), y1 = p1.attr("cy");
        var x2 = p2.attr("cx"), y2 = p2.attr("cy");
        return this.drawLine(x1, y1, x2, y2);
    }

    /**
     * Removes a point from the SVG
     */
    this.erasePoint = function(point) {
        var cx = point.attr("cx");
        var cy = point.attr("cy");
        var r = point.attr("r");

        var transition = settings.transition;
        var delay = settings.delay;
        function animateProcess() {
            var promise = Velocity(point.node(), {
                r: 0
            }, {
                delay: delay,
                duration: transition
            }, "easeInSine").then(function() {
                point.remove();
            });
            return promise;
        }
        enqueueProcess(animateProcess);
    }

    /**
     * Removes a line from the SVG
     */
    this.eraseLine = function(line) {
        var x1 = line.attr("x1"), x2 = line.attr("x2");
        var y1 = line.attr("y1"), y2 = line.attr("y2");

        var transition = settings.transition;
        var delay = settings.delay;
        function animateProcess() {
            var promise = Velocity(line.node(), {
                x2: x1,
                y2: y1
            }, {
                delay: delay,
                duration: transition
            }, "easeInSine").then(function() {
                line.remove();
            });
            return promise;
        }
        enqueueProcess(animateProcess);
    }

    /**
     * Sets the graphics color to the hex string provided (takes string starting with #)
     */
    this.setColor = function(color) {
        settings.color = color;
    }

    /**
     * Sets the stroke for drawing lines (takes a number in pixels)
     */
    this.setStroke = function(stroke) {
        settings.stroke = stroke;
    }

    /**
     * Sets the time in milliseconds it should take to complete a graphics operation
     *   A value of zero with not use an animation
     */
    this.setTransition = function(transition) {
        settings.transition = transition;
    }

    /**
     * Sets the time in milliseconds the animation should be delayed
     *   The delay occurs before the requested animation
     */
    this.setDelay = function(delay) {
        settings.delay = delay;
    }

    /**
     * Gets the width of the SVG element
     */
    this.getWidth = function() {
        return parseInt(svg.style("width").replace("px", ""));
    }

    /**
     * Gets the height of the SVG element
     */
    this.getHeight = function() {
        return parseInt(svg.style("height").replace("px", ""));
    }

    /**
     * Clears all SVG elements from the screen
     */
    this.clearAll = function() {
        svg.selectAll("circle").remove();
        svg.selectAll("line").remove();
    }
}
