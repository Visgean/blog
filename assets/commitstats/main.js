var width = 670,
    height = 110,
    cellSize = 12; // cell size

var percent = d3.format(".1%"),
    format = d3.time.format("%Y-%m-%d");


// Determines color range, turns continuous values to deterministic, we have only 11 colors
var color = d3.scale.quantize()
    .domain([0, 30])
    .range(d3.range(7).map(function (d) {
        return "intensity" + d;
    }));


// Create year elements
var svg = d3.select(".post-content").selectAll("svg")
    .data(d3.range(2011, 2016))
    .enter().append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "year")
    .append("g")
    .attr("transform", "translate(" + ((width - cellSize * 53) / 2) + "," + (height - cellSize * 7 - 1) + ")");

// add year label
svg.append("text")
    .attr("transform", "translate(-6," + cellSize * 3.5 + ")rotate(-90)")
    .attr("class", "label")
    .style("text-anchor", "middle")
    .text(function (year) {
        return year;
    });


// add days definitions
var rect = svg.selectAll(".day")
    .data(function (d) {
        return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1));
    })
    .enter().append("rect")
    .attr("class", "day")
    .attr("width", cellSize)
    .attr("height", cellSize)
    .attr("x", function (d) {
        return d3.time.weekOfYear(d) * cellSize;
    })
    .attr("y", function (d) {
        return d.getDay() * cellSize;
    })
    .datum(format);

// labels for title
rect.append("title")
    .text(function (d) {
        return d;
    });

svg.selectAll(".month")
    .data(function (year) {
        return d3.time.months(new Date(year, 0, 1), new Date(year + 1, 0, 1));
    })
    .enter().append("path")
    .attr("class", "month")
    .attr("d", monthPath);


d3.csv("/assets/commitstats/daily_stats.csv", function (error, csv) {
    if (error) throw error;

    var data = d3.nest()
        .key(function (row) {
            return row.date;
        })
        .map(csv);

    rect.filter(function (d) {
            return d in data;
        })
        .attr("class", function (d) {
            return "day " + color(data[d][0].commits);
        })
        .select("title")
        .text(function (d) {
            return d + ': ' + data[d][0].commits;
        });
});

function monthPath(t0) {
    var d0 = t0.getDay();
    var w0 = d3.time.weekOfYear(t0);

    var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0);
    var d1 = t1.getDay();
    var w1 = d3.time.weekOfYear(t1);

    return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
        + "H" + w0 * cellSize + "V" + 7 * cellSize
        + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
        + "H" + (w1 + 1) * cellSize + "V" + 0
        + "H" + (w0 + 1) * cellSize + "Z";
}

d3.select(self.frameElement).style("height", "2910px");
