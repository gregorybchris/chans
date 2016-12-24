/**
 * Graphics Class
 */
var Graphics = function(svgID) {
    var settings = {
        color: "#000",
        stroke: 2,
        glow: true,
        transition: 250
    }
    var pointSize = 6;
    var svg;
    init();

    function init() {
        svg = d3.select(svgID);
        addGlowEffect();
    }

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

    this.setGlow = function(glow) {
        settings.glow = glow;
    }

    this.setColor = function(color) {
        settings.color = color;
    }

    this.setStroke = function(stroke) {
        settings.stroke = stroke;
    }

    this.setTransition = function(transition) {
        settings.transition = transition;
    }

    this.drawPoint = function(x, y) {
        var point = svg.append("circle")
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

    this.drawLine = function(x1, y1, x2, y2) {
        var line = svg.append("line")
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

    this.remove = function(element) {
        element.remove();
    }

    this.getWidth = function() {
        return parseInt(svg.style("width").replace("px", ""));
    }

    this.getHeight = function() {
        return parseInt(svg.style("height").replace("px", ""));
    }

    this.clearAll = function() {
        svg.selectAll("circle").remove();
        svg.selectAll("line").remove();
    }

    // this.getSVG = function() {
    //     return svg;
    // }
}
