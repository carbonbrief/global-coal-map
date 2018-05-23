var margin = {top: 20, right: 70, bottom: 30, left: 45},
    width = 450 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var parseDate = d3.timeParse("%Y");
var parseDate2 = d3.timeParse("%Y%m%d");

var x = d3.scaleTime()
    .range([0, width]);

var y = d3.scaleLinear()
    .range([height, 0]);

var color = d3.scaleOrdinal()
    // thinking it might be nice to do a different colour for an average
    .domain(["Africa and Middle East", "China", "EU28", "Former USSR", "India", "Latin America", "Non-EU Europe", "Other",  "Other Asia", "United States"])
    .range(["#ffc83e", "#ffc83e", "#ffc83e", "#ffc83e", "#ffc83e", "#ffc83e", "#ffc83e", "#ffc83e", "#ffc83e", "#ffc83e"]);

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

var svg2 = d3.select("#line-chart-background").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var yearFormat = d3.timeFormat("%Y");

var decimalFormat = d3.format(".1f");

// data for background trace lines
var allData = {"Africa and Middle East":true,"China":true,"EU28":true, "Former USSR": true, "India":true, "Latin America":true, "Non-EU Europe": true,  "Other":true, "Other Asia":true, "United States":true };
// powerplants to be shown
var filterData={"Africa and Middle East":true,"China":true,"EU28":true, "Former USSR": true, "India":true, "Latin America":true, "Non-EU Europe": true,  "Other":true, "Other Asia":true, "United States":true };

function drawChart(filterData){
    d3.csv("./data/line.csv", function(error, data) {

        color.domain(d3.keys(data[0]).filter(function(key) { return key !== "year"; }));

        data.forEach(function(d) {
            d.year = parseDate(d.year);
        });

        var powerplants = color.domain().map(function(name) {
            return {
            name: name,
            values: data.map(function(d) {
                return {
                    year: d.year, 
                    capacity: +d[name]
                };
            })
            };
        });
    
        // extend x domain of line chart so that bars align

        x.domain([

            parseDate2(19990701), parseDate2(20170701)

        ]);

        y.domain([

            d3.min(powerplants, function(c) { return d3.min(c.values, function(v) { return v.capacity; }); }),
            d3.max(powerplants, function(c) { return d3.max(c.values, function(v) { return v.capacity; }); })

        ]);

        svg.selectAll("*").remove();



        // LINK BEHAVIOUR TO DROPDOWN

        d3.select("#selectorRegion").on("change", selectRegion)

        function selectRegion() {

            var region = this.options[this.selectedIndex].value

            reDraw(region);

            console.log(region);
        }


        // ADD AXES
            
        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

        // ADD AXIS LABEL

        svg.append("text")
            .attr("class", "axis label")
            .attr("transform", "rotate(-90)")
            .attr("y", 8)
            .attr("dy", ".5em")
            .style("text-anchor", "end")
            .text("Capacity (MW)");

        // ADD UNDERLAY TO TRACK MOUSE MOVEMENTS FOR CROSSHAIR

        svg.append('rect')
        .attr("class", "overlay")
        .attr("width", width)
        .attr("height", height)
        .on("mouseover", mouseover)
        .on("mouseout", mouseout)
        .on("mousemove", mousemove)

        // ADD LINES
    
        var boo=powerplants.filter(function(d){return filterData[d.name]==true;});
        console.log("filter");
        console.log(boo);
    
        var plant = svg.selectAll(".plant")
        .data(powerplants.filter(function(d){return filterData[d.name]==true;}))
        .enter().append("g");
        
        console.log(plant);

        svg.selectAll(".plant")
        .data(powerplants.filter(function(d){return filterData[d.name]==true;}))
        .append("g")
        .attr("class", "plant");
        
        svg.selectAll(".plant")
        .data(powerplants.filter(function(d){return filterData[d.name]==true;}))
        .exit()
        .remove();
    
        plant.append("path")
        .attr("class", "line")
        .attr("d", function(d) { return line(d.values); })
        .style("stroke", function(d) { return color(d.name); });

        // ADD DOTS WITH TOOLTIP

        plant.selectAll("circle")
        .data(function(d){return d.values})
        .enter()
        .append("circle")
        .attr("r", 4)
        .attr("cx", function(d) { return x(d.year); })
        .attr("cy", function(d) { return y(d.capacity); })
        // in order to have a the circle to be the same color as the line, you need to access the data of the parentNode
        .attr("fill", function(d){return color(this.parentNode.__data__.name)})
        .attr("opacity", 0)
        .on("mouseover", function(d) {
            //show circle
            d3.select(this)
            .transition()
            .duration(200)
            .style("opacity", 0.5)
            .attr("r", 5);
            // show tooltip
            div.transition()
            .duration(100)
            .style("opacity", .9);
            div.html( "<h3 style= color:" + color(this.parentNode.__data__.name) + 
            ";>" + this.parentNode.__data__.name + 
            "</h3><p>Year: <b>" + getYear[yearFormat(d.year)] + 
            "</b></p><p> Capacity: <b>" + decimalFormat(d.capacity) + 
            " MW</b></p>")
            .style("left", (d3.event.pageX + 20) + "px")
            .style("top", (d3.event.pageY - 50) + "px");
            })
        .on("mouseout", function(d) {
            d3.select(this)
            .transition()
            .duration(200)
            .style("opacity", 0)
            .attr("r", 4);
            // hide tooltip
            div.transition()
            .duration(200)
            .style("opacity", 0);
        });

        // ADD CROSSHAIR

        var focus = svg.append('g')
        .attr('class', 'focus')
        .style('display', 'none');

        var tooltip = d3.select('#tooltip');

        // append x position tracking line, originally positioned at 0

        focus.append('line')
        .attr('class', 'x-hover-line hover-line')
        .attr('y1' , 0)
        .attr('y2', height);

        function mouseover() {
            focus.style("display", null);
            tooltip.style("display", "block");
        }

        function mouseout() {
            focus.style("display", "none");
            tooltip.style("display", "none");
        }

        var timeScales = data.map(function(d) { return x(d.year); });

        function mousemove(d) {

            // gets line to follow mouse along discreeet data lines, deleted tooltip as this stopped the line appearing for 2017

            var i = d3.bisect(timeScales, d3.mouse(this)[0], 1),
                d0 = data[i-1],
                d1 = data[i];

            focus.attr("transform", "translate(" + x(d0.year) + ",0)"); 

        }

    });

}

// FUNCTION TO DRAW TRACE LINES

function drawBackground(allData) {
    d3.csv("./data/line.csv", function(error, data) {

        color.domain(d3.keys(data[0]).filter(function(key) { return key !== "year"; }));

        data.forEach(function(d) {
            d.year = parseDate(d.year);
        });

        var powerplants2 = color.domain().map(function(name) {
            return {
            name: name,
            values: data.map(function(d) {
                return {
                    year: d.year, 
                    capacity: +d[name]
                };
            })
            };
        });
    
        // extend x domain of line chart so that bars align

        x.domain([

            parseDate2(19990701), parseDate2(20170701)

        ]);

        y.domain([

            d3.min(powerplants2, function(c) { return d3.min(c.values, function(v) { return v.capacity; }); }),
            d3.max(powerplants2, function(c) { return d3.max(c.values, function(v) { return v.capacity; }); })

        ]);

        svg2.selectAll("*").remove();

        var boo2 =powerplants2.filter(function(d){return allData[d.name]==true;});
        console.log("filter");
        console.log(boo2);
    
        var plant2 = svg2.selectAll(".plant-background")
        .data(powerplants2.filter(function(d){return allData[d.name]==true;}))
        .enter().append("g");
        
        console.log(plant2);

        svg2.selectAll(".plant-background")
        .data(powerplants2.filter(function(d){return allData[d.name]==true;}))
        .append("g")
        .attr("class", "plant-background");
        
        svg2.selectAll(".plant-background")
        .data(powerplants2.filter(function(d){return allData[d.name]==true;}))
        .exit()
        .remove();
    
        plant2.append("path")
        .attr("class", "background-line")
        .attr("d", function(d) { return line(d.values); });

    });
}

// draw initial chart

drawBackground(allData);
drawChart(filterData);

// LINK CHART TO DROPDOWN

function reDraw(region){
    
    if (region == "All") {
        filterData = {"Africa and Middle East":true,"China":true,"EU28":true, "Former USSR": true, "India":true, "Latin America":true, "Non-EU Europe": true,  "Other":true, "Other Asia":true, "United States":true };
    }  else {
        filterData = {[region]: true};
    }
	console.log("redraw :");
	console.log(filterData);
    drawChart(filterData);
    
}