const jsdom = require(`jsdom`);
const { JSDOM } = jsdom;
const inputData = require(`./data`);
const d3 = require("d3");
const fs = require("fs");

const actualData = inputData.aggregations.time_split.buckets.map(item => {
  return { ...item, useFulDate: new Date(item.key_as_string) };
});

const fakeDom = new JSDOM("<!DOCTYPE html><html><body></body></html>");
const margin = { top: 20, right: 20, bottom: 70, left: 40 };
const width = 900 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

let body = d3.select(fakeDom.window.document).select("body");

let svgContainer = body
  .append("div")
  .attr("class", "container")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

let dateArray = actualData.map((d) => d.useFulDate); 
var yScale = d3.scaleLinear().range([height, 0]).domain([0,d3.max(actualData, (d) => d.doc_count)]);
var yAxis = d3.axisLeft().scale(yScale).ticks(5);
var xScale = d3.scaleTime().range([0, width]).domain([dateArray[0], dateArray[dateArray.length - 1]]);
var xAxis = d3.axisBottom().scale(xScale).ticks(d3.timeHour);

svgContainer
  .append("g")
  .attr("class", "y axis")
  .call(yAxis)
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", -6)
  .attr("dy", "-.71em")
  .style("text-anchor", "end")
  .text("Messages")
  .style("fill", "black");

  svgContainer
  .append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis)
  .selectAll("text")
  .style("text-anchor", "end")
  .attr("dx", "-.8em")
  .attr("dy", "-.55em")
  .attr("transform", "rotate(-90)");

  svgContainer.selectAll("bar")
        .data(actualData)
        .enter()
            .append("rect")
            .style("fill", "steelblue")
            .attr("x", function(d) { return xScale( new Date(d.useFulDate) ); })
            .attr("width", width / actualData.length)
            .attr("y", function(d) { return yScale(d.doc_count); })
            .attr("height", function(d) { return height - yScale(d.doc_count); });

/* body.select(".container").html() will give the actual SVG for the graphic */

fs.writeFileSync(`somefile.svg`, body.select(".container").html());
