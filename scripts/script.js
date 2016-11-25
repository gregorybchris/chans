var svg = d3.select("#graphics-canvas").append("svg")
    .attr("class", "graphics-svg");

var jsonCircles = [
     { "x": 150, "y": 150, "r": 8 },
     { "x": 70, "y": 70, "r": 8 },
     { "x": 110, "y": 100, "r": 8 }];

var circles = svg.selectAll("circle")
    .data(jsonCircles)
    .enter()
    .append("circle");

var circleAttributes = circles
    .attr("cx", function (d) { return d.x; })
    .attr("cy", function (d) { return d.y; })
    .attr("r", function (d) { return d.r; })
    .attr("fill", function (d) { return "rgb(240, 50, 50)" });
