/**
 * Graphics Class
 */
var Graphics = function(svgID) {
    var settings = {
        color: "#000",
        stroke: 3,
        glow: false,
        transition: 250
    }
    var pointSize = 6;
    var svg;
    init();

    /**
     * Acts as a constructor for the Graphics class
     */
    function init() {
        svg = d3.select(svgID);
        addGlowEffect();
        setupTypes();
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
     * Creates a glow effect and adds it to the SVG
     */
    function addGlowEffect() {
        var defs = svg.append("defs");
        var filter = defs.append("filter")
            .attr("id","glow-effect");
        filter.append("feGaussianBlur")
            .attr("stdDeviation","1.5")
            .attr("result","coloredBlur");
        var feMerge = filter.append("feMerge");
        feMerge.append("feMergeNode")
            .attr("in","coloredBlur");
        feMerge.append("feMergeNode")
            .attr("in","SourceGraphic");
    }

    /**
     * Sets glow to the boolean provided
     */
    this.setGlow = function(glow) {
        settings.glow = glow;
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
     * Draws a point to the SVG
     */
    this.drawPoint = function(x, y) {
        var point = svg.select("#points").append("circle")
            .attr("class", "point")
            .attr("cx", x).attr("cy", y).attr("r", 0)
            .attr("fill", settings.color);

        if (settings.glow)
            point = point.style("filter", "url(#glow-effect)");

        var promise = Velocity(point.node(), { r: pointSize }, {
            duration: settings.transition
        }, "easeInSine");

        return {
            point: point,
            promise: promise
        };
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
            .attr("stroke-width", settings.stroke);

        if (settings.glow)
            line = line.style("filter", "url(#glow-effect)");

        var promise = Velocity(line.node(), { x2: x2, y2: y2 }, {
            duration: settings.transition
        }, "easeInSine");

        return {
            line: line,
            promise: promise
        };
    }

    /**
     * Removes a line from the SVG
     */
    this.removeLine = function(line) {
        var x1 = line.attr("x1"), x2 = line.attr("x2");
        var y1 = line.attr("y1"), y2 = line.attr("y2");

        var promise = Velocity(line.node(), { x2: x1, y2: y1 }, {
            duration: settings.transition
        }, "easeInSine").then(function() {
            line.remove();
        });

        return promise;
    }

    /**
     * Removes an SVG element from the SVG
     */
    this.remove = function(element) {
        element.remove();
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
