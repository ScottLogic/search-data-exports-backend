const { JSDOM } = require(`jsdom`);
const d3 = require("d3");

class SVGBuilder {
  constructor() {
    this._setDefaults();
  }

  _setDefaults() {
    this._width = 900;
    this._height = 400;
    this._radius = Math.min(this._width, this._height) / 2;
  }

  _cleanseData(inputData) {
    this._formattedData = inputData.aggregations.types_count.buckets;
  }

  _buildContainer() {
    const fakeDom = new JSDOM("<!DOCTYPE html><html><body></body></html>");
    this._body = d3.select(fakeDom.window.document).select("body");
    this._svgContainer = this._body
      .append("div")
      .attr("class", "container") // class is only used to grab the correct element later.
      .append("svg")
      .data([this._formattedData])
      .attr("height", this._height)
      .attr("width", this._width)
      .append("g")
      .attr(
        "transform",
        "translate(" + this._width / 2 + "," + this._height / 2 + ")"
      );

    this._svgContainer.append("g").attr("class", "labels");
    this._svgContainer.append("g").attr("class", "lines");
    this._svgContainer.append("g").attr("class", "slices");
  }

  _buildArcs() {
    this._sliceArc = d3
      .arc()
      .outerRadius(this._radius * 0.8)
      .innerRadius(this._radius * 0.1);

    this._labelArc = d3
      .arc()
      .innerRadius(this._radius * 0.9)
      .outerRadius(this._radius * 0.9);

    this._valueArc = d3
      .arc()
      .innerRadius(this._radius * 0.7)
      .outerRadius(this._radius * 0.7);
  }

  _buildColors() {
    this._color = d3.schemePaired;
  }

  _buildPie() {
    this._pie = d3.pie().value(entry => entry.doc_count);
  }

  _buildSlices() {
    const arcs = this._svgContainer
      .select(".slices")
      .selectAll("g.slice")
      .data(this._pie);

    arcs
      .enter()
      .append("svg:g")
      .attr("class", "slice")
      .append("svg:path")
      .attr("fill", (entry, index) => this._color[index % this._color.length])
      .attr("d", this._sliceArc);

    arcs
      .enter()
      .append("svg:text")
      .attr(
        "transform",
        entry => "translate(" + this._valueArc.centroid(entry) + ")"
      )
      .attr("text-anchor", "middle")
      .text(entry => entry.data.doc_count);
  }

  _buildLabels() {
    const midAngle = d => d.startAngle + (d.endAngle - d.startAngle) / 2;
    this._svgContainer
      .select(".labels")
      .selectAll("text")
      .data(this._pie)
      .enter()
      .append("text")
      .attr("dy", ".35em")
      .text(d => d.data.key)
      .attr("transform", entry => {
        let positionArray = this._labelArc.centroid(entry);
        positionArray[0] = this._radius * (midAngle(entry) < Math.PI ? 1 : -1);
        return "translate(" + positionArray + ")";
      })
      .style("text-anchor", entry =>
        midAngle(entry) < Math.PI ? "start" : "end"
      );

    this._svgContainer
      .select(".lines")
      .selectAll("polyline")
      .data(this._pie)
      .enter()
      .append("polyline")
      .attr("style", "stroke: black;fill: none;stroke-width: 2px;opacity: 0.3;")
      .attr("points", entry => {
        let positionArray = this._labelArc.centroid(entry);
        positionArray[0] =
          this._radius * 1 * (midAngle(entry) < Math.PI ? 1 : -1);
        return [
          this._sliceArc.centroid(entry),
          this._labelArc.centroid(entry),
          positionArray
        ];
      });
  }

  build(data) {
    this._cleanseData(data);
    this._buildContainer();
    this._buildArcs();
    this._buildColors();
    this._buildPie();
    this._buildSlices();
    this._buildLabels();
    return this._body.select(".container").html();
  }
}

module.exports = SVGBuilder;
