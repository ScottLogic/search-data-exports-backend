const d3 = require('d3');
const { JSDOM } = require('jsdom');

class SVGBuilder {
  constructor() {
    this._setDefaults();
  }

  _setDefaults() {
    this._margin = {
      top: 20,
      right: 20,
      bottom: 70,
      left: 40
    };
    this._width = 900 - this._margin.left - this._margin.right;
    this._height = 600 - this._margin.top - this._margin.bottom;
  }

  _cleanseData(inputData) {
    this._formattedData = inputData.aggregations.time_split.buckets.map(item => ({
      ...item,
      formattedDate: new Date(item.key_as_string)
    }));
  }

  _buildContainer() {
    const fakeDom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
    this._body = d3.select(fakeDom.window.document).select('body');
    this._svgContainer = this._body
      .append('div')
      .attr('class', 'container') // class is only used to grab the correct element later.
      .append('svg')
      .attr('width', this._width + this._margin.left + this._margin.right)
      .attr('height', this._height + this._margin.top + this._margin.bottom)
      .attr('viewbox', `0 0 ${this._width + this._margin.left + this._margin.right} ${this._height + this._margin.top + this._margin.bottom}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .attr('xmlns', 'http://www.w3.org/2000/svg')
      .append('g')
      .attr('transform', `translate(${this._margin.left}, ${this._margin.top})`);
  }

  _buildScales() {
    const dateArray = this._formattedData.map(d => d.formattedDate);
    this._yScale = d3
      .scaleLinear()
      .range([this._height, 0])
      .domain([0, d3.max(this._formattedData, data => data.doc_count)]);
    this._yAxis = d3
      .axisLeft()
      .scale(this._yScale)
      .ticks(5);
    this._xScale = d3
      .scaleTime()
      .range([0, this._width])
      .domain([dateArray[0], dateArray[dateArray.length - 1]]);
    this._xAxis = d3
      .axisBottom()
      .scale(this._xScale)
      .ticks(d3.timeHour);
  }

  _buildAxis() {
    this._svgContainer
      .append('g')
      .call(this._yAxis)
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -6)
      .attr('dy', '-.71em')
      .style('text-anchor', 'end')
      .text('Messages')
      .style('fill', 'black');

    this._svgContainer
      .append('g')
      .attr('transform', `translate(0, ${this._height})`)
      .call(this._xAxis)
      .selectAll('text')
      .style('text-anchor', 'end')
      .attr('dx', '-.8em')
      .attr('dy', '-.55em')
      .attr('transform', 'rotate(-90)');
  }

  _buildContent() {
    this._svgContainer
      .selectAll('bar')
      .data(this._formattedData)
      .enter()
      .append('rect')
      .style('fill', 'steelblue')
      .attr('x', data => this._xScale(new Date(data.formattedDate)))
      .attr('width', this._width / this._formattedData.length)
      .attr('y', data => this._yScale(data.doc_count))
      .attr('height', data => this._height - this._yScale(data.doc_count));
  }

  build(data) {
    this._cleanseData(data);
    this._buildContainer();
    this._buildScales();
    this._buildAxis();
    this._buildContent();
    return this._body.select('.container').html();
  }
}

module.exports = SVGBuilder;
