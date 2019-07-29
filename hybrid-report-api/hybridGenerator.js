const pdf = require('html-pdf'); // npm package being used
const ESSearch = require('./common/search');
const SVGBuilder = require('./common/svgbuilder');
const S3Output = require('./common/s3-output');
const pdfTemplate = require('./template/htmlbase');

class HybridGenerator {
  constructor(ConnectionOptions, bucketName) {
    this._search = new ESSearch(ConnectionOptions);
    this._store = new S3Output(bucketName);
  }

  async generateReport(paramJSON = {}) {
    const reportData = await this.getReportData(paramJSON);
    const svgData = await this.buildSVG(reportData);
    const formattedHTML = await this.buildHTML({
      svgData,
      searchResults: reportData
    });
    console.log(`HTML`,formattedHTML);
    const pdfBuffer = await this.buildPDF({ formattedHTML });
    console.log(`PDF Buffer:`,pdfBuffer);
    const pdfFileName = await this.saveToBucket({ pdfBuffer });

    return pdfFileName;
  }

  async getReportData(paramJSON) {
    const reportData = await this._search.search(this.buildRequestJSON(paramJSON));
    return reportData;
  }

  static async buildSVG(ESResults) {
    const svgbuilder = new SVGBuilder();
    const searchResult = await svgbuilder.build(ESResults);
    return searchResult;
  }

  static async buildHTML({ searchResults, svgData }) {
    const htmlString = await pdfTemplate({
      svgData,
      tableData: searchResults.aggregations.types_count.buckets
    });
    return htmlString;
  }

  static makePDF(formattedHTML, successResponse, errorResponse) {
    const pdfOptions = {
      format: 'A4',
      orientation: 'portrait',
      border: '10'
    };
    pdf.create(formattedHTML, pdfOptions).toStream((err, res) => {
      console.log(`Into Stream function`,err,res);
      if (err) errorResponse(err);
      successResponse(res);
    });    
  }

  buildPdfWrapper(formattedHTML) {
    return new Promise((resolve, reject) => {
      this.makePDF(
        formattedHTML,
        (successResponse) => {
          resolve(successResponse);
        },
        (errorResponse) => {
          reject(errorResponse);
        }
      );
    });
  }

  async buildPDF({ formattedHTML = '' }) {
    try {
      console.log(`BuildPDF`);
      return await this.buildPdfWrapper(formattedHTML);
    } catch (error) {
      console.log(`Error Happened`,error);
      return null;
    }
  }

  async saveToBucket({ pdfBuffer }) {
    this._store.addBuffer(pdfBuffer);
    const fileURL = await this._store.close();
    return fileURL;
  }

  static buildRequestJSON(paramJSON = {}) {
    const dateRange = paramJSON.search.find(x => x.dateRange);
    const startDate = new Date(dateRange ? dateRange.dateRange[0] : Date.now());
    const endDate = new Date(dateRange ? dateRange.dateRange[1] : Date.now());
    if (!dateRange) {
      startDate.setDate(startDate.getDate() - 1)
    }

    return {
      index: 'posts',
      size: 0,
      body: {
        aggs: {
          types_count: {
            terms: {
              field: 'Tags.keyword',
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
