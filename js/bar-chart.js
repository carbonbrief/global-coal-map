function getHeight () {
    if (screenWidth > 1050) {
        return 300
    } else if (screenWidth < 1050) {
        return 260
    } 
}

var responsiveHeight = getHeight();

// set the dimensions and margins of the graph
var margin = {top: 8, right: 15, bottom: 30, left: 45},
    width = parseInt(d3.select("#line-wrapper").style("width")) - margin.left - margin.right,
    height = (responsiveHeight + 2) - margin.top - margin.bottom;

// different names to line chart

var x3 = d3.scaleBand()
    .range([0, width])
    .padding(0.01);

var y3 = d3.scaleLinear()
    .range([height, 0]);
          
// append the svg object to the body of the page. need to do it only once for the line and bar background

var svg3 = d3.select("#bar-chart").append("svg")
    .attr("id", "svg-3")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

// get the data
d3.csv("./data/bar.csv", function(error, data) {
  if (error) throw error;

  // format the data
  data.forEach(function(d) {
    d.value = +d.value;
  });

  // Scale the range of the data in the domains
  x3.domain(data.map(function(d) { return d.year; }));
  y3.domain([0, d3.max(data, function(d) { return d.value; })]);

  // append the rectangles for the bar chart
  svg3.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x3(d.year); })
      .attr("width", x3.bandwidth())
      .attr("y", function(d) { return y3(d.value); })
      .attr("height", function(d) { return height - y3(d.value); })
      .style("opacity", 0);

    svg3.selectAll(".bar")
      .filter(function(d) { return d.year == 2018 })
      .transition()
      .duration(800)
      .style("opacity", 1);

//   not adding any axes since just for highlighting


});


// link behaviour to slider
// will just be changing opacity, so can avoid filtering data

d3.selectAll(".row").on("input", highlightYear);

function highlightYear() {

    var thisYear = this.value;

    svg3.selectAll(".bar")
        .style("opacity", 0);

    svg3.selectAll(".bar")
        .filter(function(d) { 
            return d.year == thisYear
        })
        .style("opacity", 1);


    //console.log(thisYear);
}