var svg = d3.select("#graphics-canvas")
    .attr("class", "graphics-svg");

var defs = svg.append("defs");

svg.on("click", function() {
    addPoint(event.offsetX, event.offsetY);
});

function addPoint(x, y) {
    var circle = svg.append("circle")
        .attr("class", "point")
        .attr("cx", x)
        .attr("cy", y)
        .attr("r", 16)
        .attr("fill", "#DDD");
    addGlow(circle);
    d3.selectAll(".class-of-elements")
	.style("filter", "url(#glow)");

    // console.log(circle);
    // circle.each(function(x) {
    //     console.log(x);
    // });

    // Velocity(circle, { r:20 });

    $("circle.point").each(function() {
        Velocity($(this), { r: 5, fill: "#999" }, { duration: 250 }, "easeInSine");
    })
}

function addGlow(element) {
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
    element.style("filter", "url(#glow)");
}

//
// svg.on("mousemove", function() {
//     var x = event.offsetX, y = event.offsetY;
//     console.log(x)
//     svg.select("circle.placing").remove();
//     svg.append("circle")
//         .attr("class", "placing")
//         .attr("cx", x)
//         .attr("cy", y)
//         .attr("r", 4)
//         .attr("fill", "rgb(110, 110, 110)");
// });



// var jsonCircles = [
//      { "x": 150, "y": 150, "r": 8 },
//      { "x": 70, "y": 70, "r": 8 },
//      { "x": 110, "y": 100, "r": 8 }];
//
// var circles = svg.selectAll("circle")
//     .data(jsonCircles)
//     .enter()
//     .append("circle");
//
// var circleAttributes = circles
//     .attr("cx", function (d) { return d.x; })
//     .attr("cy", function (d) { return d.y; })
//     .attr("r", function (d) { return d.r; })
//     .attr("fill", function (d) { return "rgb(240, 50, 50)" });
