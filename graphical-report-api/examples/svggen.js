const jsdom = require(`jsdom`);
const { JSDOM } = jsdom;
const inputData = require(`./data`);
const d3 = require("d3");
const fs = require("fs");

const actualData = inputData.aggregations.time_split.buckets.map(item => 
  ({ ...item, formattedDate: new Date(item.key_as_string) })
);

const fakeDom = new JSDOM("<!DOCTYPE html><html><body></body></html>");
const margin = { top: 20, right: 20, bottom: 70, left: 40 };
const width = 900 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;

const body = d3.select(fakeDom.window.document).select("body");

const svgContainer = body
  .append("div")
  .attr("class", "container")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const dateArray = actualData.map(d => d.formattedDate); 
// Now for some reason the scale below, doesnt accept the full list, so we have to split it out, and use the first/last elements only
const yScale = d3.scaleLinear().range([height, 0]).domain([0,d3.max(actualData, data => data.doc_count)]);
const yAxis = d3.axisLeft().scale(yScale).ticks(5);
const xScale = d3.scaleTime().range([0, width]).domain([dateArray[0], dateArray[dateArray.length - 1]]);
const xAxis = d3.axisBottom().scale(xScale).ticks(d3.timeHour);

svgContainer
  .append("g")
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
            .attr("x", data => xScale( new Date(data.formattedDate) ) )
            .attr("width", width / actualData.length)
            .attr("y", data => yScale(data.doc_count)) 
            .attr("height", data => height - yScale(data.doc_count));

/* body.select(".container").html() will give the actual SVG for the graphic */

fs.writeFileSync(`somefile.svg`, body.select(".container").html());
