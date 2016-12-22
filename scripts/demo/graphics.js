/**
 * Graphics Class
 */
var Graphics = function(svgID) {
    var svg;
    init();

    function init() {
        svg = d3.select(svgID);
        addGlowEffect();
    }

    function addGlowEffect() {
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

    this.drawPoint = function(x, y) {
        var point = svg.append("circle")
            .attr("class", "point")
            .attr("cx", x).attr("cy", y).attr("r", 0)
            .attr("fill", "#999")
            .style("filter", "url(#glow)");
        Velocity(point.node(), { r: 6 }, { duration: 250 }, "easeInSine");
        return point;
    }

    this.drawLine = function(x1, y1, x2, y2) {
        var line = svg.append("line")
            .attr("class", "edge")
            .attr("x1", x1).attr("y1", y1)
            .attr("x2", x1).attr("y2", y1)
            .attr("stroke", "#55F").attr("stroke-width", "2")
            .style("filter", "url(#glow)");
        Velocity(line.node(), { x2: 200, y2: 200 }, { duration: 500, complete: function() {alert("done");}}, "easeInSine");
        return line;
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
}
