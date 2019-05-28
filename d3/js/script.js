"use strict";


// Basic graph variables
var fullDatasetBarChart = null,
	updateGraphData = null,
	currSubset = null,
	y = null,
	x = null,
	canvas = null,
	threshold = null,
	xAxisScale = null,
	tip = null;


// Graph dimensions
var margin = {
		top: 10,
		right: 10,
		bottom: 20,
		left: 30
	},
	barPadding = .2,
	height = 400 - margin.top - margin.bottom;

/**
 * This function gets list of values for Subset Dropdown
 * @param {json} graph data in json format
 * @return {list} list of dropdown values
 */
function getDropdownValues(json) {
	var subsetList = [];
	json.forEach(function (d) {
		subsetList.push(d.SUB);
	});
	var uniqueVals = subsetList.filter((v, i, a) => a.indexOf(v) === i);

	return uniqueVals;
}

/**
 * This function gets graph data for given subset
 * @param {json} data from BE in json format
 * @param {subset} data subset name
 * @return {data} data to be used to update graph
 */
function getGraphDatabySubset(json, subset) {
	var data = [];

	json.forEach(function (d) {
		if (d.SUB === subset) {
			data.push(d);
		}
	});
	return data;
}

/**
 * This function sets up d3 bar graph
 */
function barChartInit() {

	// Hardcoded dummy data for now
	fullDatasetBarChart = [
		{'SUB':'Subset A', 'XVAL':'A', 'YVAL': 10},
		{'SUB':'Subset A', 'XVAL':'B', 'YVAL': 40},
		{'SUB':'Subset A', 'XVAL':'C', 'YVAL': -20},
		{'SUB':'Subset A', 'XVAL':'D', 'YVAL': -5},
		{'SUB':'Subset A', 'XVAL':'E', 'YVAL': 44},
		{'SUB':'Subset B', 'XVAL':'A', 'YVAL': -20},
		{'SUB':'Subset B', 'XVAL':'B', 'YVAL': 40},
		{'SUB':'Subset B', 'XVAL':'C', 'YVAL': 50},
		{'SUB':'Subset B', 'XVAL':'D', 'YVAL': -10},
		{'SUB':'Subset B', 'XVAL':'E', 'YVAL': 60},
		{'SUB':'Subset B', 'XVAL':'F', 'YVAL': -8},
		{'SUB':'Subset B', 'XVAL':'G', 'YVAL': 15},
		{'SUB':'Subset B', 'XVAL':'H', 'YVAL': -10},
		{'SUB':'Subset B', 'XVAL':'I', 'YVAL': -40},
		{'SUB':'Subset B', 'XVAL':'J', 'YVAL': 30},
		{'SUB':'Subset B', 'XVAL':'K', 'YVAL': 25},
		{'SUB':'Subset B', 'XVAL':'L', 'YVAL': 55},
		{'SUB':'Subset B', 'XVAL':'M', 'YVAL': 10},
		{'SUB':'Subset B', 'XVAL':'N', 'YVAL': -35}
	];

	// Set threshold
	threshold = 0;

	// Get subset dropdown
	var dropdownVals = getDropdownValues(fullDatasetBarChart);

	// Define y and x axis
	y = d3.scaleLinear()
		.range([height, 0]);

	x = d3.scaleBand()
		.padding(barPadding);

	xAxisScale = d3.scaleLinear();

	var xAxis = d3.axisBottom()
		.scale(xAxisScale);

	var yAxis = d3.axisLeft()
		.scale(y);

	// Create bar tip
	tip = d3.tip()
		.attr('class', 'd3-tip')
		.offset([-10, 0])
		.html(function (d) {
			return "<span>" + d.XVAL + " : " + d.YVAL + "</span>";
		})

	// Create canvas
	canvas = d3.select("#barChart").append("svg")
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	// Add tip to graph
	canvas.call(tip);

	// Add y axis
	canvas.append("g")
		.attr("class", "y axis");

	// Add label on y axis
	canvas.append("g")
		.attr("class", "y axis")
		.append("text")
		.text("Y")
		.attr("transform", "translate(15, 25), rotate(-90)");

	// Handler for dropdown value change
	var dropdownChange = function () {
		currSubset = d3.select(this).property('value');
		updateGraphData = getGraphDatabySubset(fullDatasetBarChart, currSubset);
		// Update Graph
		updateBars();
	};

	// Set dropdown on the graph
	var dropdown = d3.select("#barChartDropdown")
		.insert("select", "svg")
		.attr("class", "form-control")
		.attr("width", "auto")
		.on("change", dropdownChange);

	dropdown.selectAll("option")
		.data(dropdownVals)
		.enter().append("option")
		.attr("value", function (d) {
			return d;
		})
		.text(function (d) {
			return d;
		});

	// Responsiveness
	window.addEventListener("resize", updateBars);

	// Load initial graph with data for first selection in SUB dropdown
	currSubset = dropdownVals[0];
	updateGraphData = getGraphDatabySubset(fullDatasetBarChart, currSubset);
	updateBars();
}

/**
 * This function updates graph bars with new data
 */
function updateBars() {
	var widther = $("#barChart").width(),
	width = widther - margin.left - margin.right,
	svgSize = '100%';

	// Show bar chart div
	$("#barChart").show();

	// If a lot of data, make bar width fixed and graph scrollable so it's readable
	if ((updateGraphData.length * 15) > width) {
		width = updateGraphData.length * 15; // number of bars times maximum bard width
		svgSize = (width + updateGraphData.length * barPadding).toString() + 'px'; //svg width + number of bars * bar padding
	}

	d3.select("#barChart").select("svg").attr("width", svgSize);

	x.rangeRound([0, width]);
	xAxisScale.range([0, width]);

	// Set x and y axis domain
	xAxisScale.domain([0, updateGraphData.length])

	x.domain(updateGraphData.map(function (d) {
		return d.XVAL;
	}));
	y.domain(d3.extent(updateGraphData, function (d) {
		return d.YVAL;
	})).nice();

	// Remove bars from previous graph, if any
	var bars = canvas.selectAll(".bar")
		.remove()
		.exit()
		.data(updateGraphData);

	// Add bars for new data
	bars.enter().append("rect")
		.attr("class", function (d) {
			if (d.YVAL < threshold) {
				return "bar negative";
			}
			else {
				return "bar positive";
			}
		})
		.attr("data-xval", function (d) {
			return d.XVAL;
		})
		.attr("data-yval", function (d) {
			return d.YVAL;
		})
		.attr("title", function (d) {
			return (d.XVAL + ": " + d.YVAL)
		})
		.attr("y", function (d) {
			if (d.YVAL > threshold) {
				return y(d.YVAL);
			}
			else {
				return y(threshold);
			}
		})
		.attr("x", function (d, i) {
			return xAxisScale(i);
		})
		.attr("width", x.bandwidth())
		.attr("height", function (d) {
			return Math.abs(y(d.YVAL) - y(threshold));
		})
		.on('mouseover', tip.show)
		.on('mouseout', tip.hide);

	// Remove previous x axis line, if any, and add new one
	d3.select("#barChart").select("svg").select(".x.axis").remove();

	canvas.append("g")
		.attr("class", "x axis")
		.append("line")
		.attr("y1", y(threshold))
		.attr("y2", y(threshold))
		.attr("x2", width);

	// Scale x and y axis
	var xAxis = d3.axisBottom()
		.scale(xAxisScale);

	var yAxis = d3.axisLeft()
		.scale(y);

	d3.select("#barChart").select("svg").select('.y.axis').call(yAxis);
}

barChartInit();