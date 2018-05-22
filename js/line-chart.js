var margin = {top: 20, right: 70, bottom: 30, left: 45},
    width = 450 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var parseDate = d3.timeParse("%Y");

var x = d3.scaleTime()
    .range([0, width]);

var y = d3.scaleLinear()
    .range([height, 0]);

var color = d3.scaleOrdinal()
    // thinking it might be nice to do a different colour for an average
    .domain(["Average", "Nuclear", "Gas", "Other", "Hydro", "Biomass",  "Waste"])
    .range(["#ea545c", "#ffc83e", "#ffc83e", "#ffc83e", "#ffc83e", "#ffc83e", "#ffc83e"]);

var xAxis = d3.axisBottom(x);

var yAxis = d3.axisLeft(y);

var line = d3.line()
    .curve(d3.curveCardinal) // see http://bl.ocks.org/emmasaunders/c25a147970def2b02d8c7c2719dc7502 for more details
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.capacity); });

var svg = d3.select("#line-chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var yearFormat = d3.timeFormat("%Y");

var decimalFormat = d3.format(".1f");