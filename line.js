let width = 1200, height = 600;


// Chart size settings
var margin = { top: 50, right: 55, bottom: 50, left: 55 }

width = 425 - margin.right - margin.left;
height = 800 - margin.top - margin.bottom;

covidCases = "https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/owid-covid-data.csv"

// Load external data
Promise.all([d3.csv(covidCases)]).then(data => {

    let input = "Singapore"
    // let attribute = "total_cases"
    let attribute = "total_cases"

    data = data[0].filter(function (d) { return d.continent != "" && d.location == input });
    countries = Array.from(new Set(data.map(function (d) { return d.location; })));

    var parseDate = d3.timeParse("%Y-%m-%d");
    data.forEach(function (d) {
        d.date = parseDate(d.date);
    });

    console.log(data);

    var lineChart = d3.select("#chart")
        .attr("preserveAspectRatio", "xMidYMid meet")
        .attr(
            'viewBox',
            '0 0 ' +
            (width + margin.left + margin.right) +
            ' ' +
            (height + margin.top + margin.bottom)
        )
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Add title
    lineChart.append("text")
        .attr("x", width / 2)
        .attr("y", 0)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text(input + "\n " + attribute.replace("_", " "));

    // Add scales
    var xScale = d3.scaleTime()
        .domain(d3.extent(data, function (d) { return d.date; }))
        .range([0, width]);

    var yScale = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) { return +d[attribute]; })])
        .range([height, 0]);

    // Add x-axis
    lineChart.append("g")
        .data(data)
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(xScale)
            .tickFormat(d3.timeFormat("%Y-%m-%d"))
        )
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("transform", "rotate(-38)");

    // Add y-axis
    lineChart.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(yScale));

    // Draw
    lineChart.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "royalblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(function (d) { return xScale(d.date) })
            .y(function (d) { return yScale(+d[attribute]) })
        )

    // lineChart.append("path")
    //     .datum(data)
    //     .attr("fill", "none")
    //     .attr("stroke", "violet")
    //     .attr("stroke-width", 1.5)
    //     .attr("d", d3.line()
    //         .x(function (d) { return xScale(d.date) })
    //         .y(function (d) { return yScale(+d.new_cases) })
    //     )

    return;
})