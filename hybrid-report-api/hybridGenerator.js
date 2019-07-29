const ESSearch = require(`./common/search`);
const SVGBuilder = require(`./common/svgbuilder`);

class HybridGenerator {
  constructor(ConnectionOptions) {
    this._search = new ESSearch(ConnectionOptions);
  }

  async generateReport(paramJSON = {}) {
    const reportData = await this.getReportData(paramJSON);  
    const svgData = await this.buildSVG( reportData );
    return svgData;
  }

  async getReportData(paramJSON) {
    return await this._search.search(this.buildRequestJSON(paramJSON));
  }

  async buildSVG( ESResults ) {
      const svgbuilder = new SVGBuilder();
      return await svgbuilder.build( ESResults );
  }

  async buildHTML() {}

  async buildPDF() {}

  async saveToBucket() {}

  buildRequestJSON(paramJSON = {}) {
    const dateRange = paramJSON.search.find(x => x.dateRange);
    let startDate = new Date(dateRange ? dateRange.dateRange[0] : Date.now());
    const endDate = new Date(dateRange ? dateRange.dateRange[1] : Date.now());
    !dateRange && startDate.setDate(startDate.getDate() - 1);

    return {
      index: "posts",
      size: 0,
      body: {
        aggs: {
          types_count: {
            terms: {
              field: "Tags.keyword",
              size: 20
            }
          }
        },
        query: {
          bool: {
            filter: [
              {
                range: {
                  DateCreated: {
                    gte: `${startDate.toISOString()}`
                  }
                }
              },
              {
                range: {
                  DateCreated: {
                    lte: `${endDate.toISOString()}`
                  }
                }
              }
            ]
          }
        }
      }
    };
  }
}

module.exports = HybridGenerator;
