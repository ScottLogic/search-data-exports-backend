const chrome = require('chrome-aws-lambda');
const puppeteer = require('puppeteer-core');
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
    const svgData = await HybridGenerator.buildSVG(reportData);
    const formattedHTML = await HybridGenerator.buildHTML({
      svgData,
      searchResults: reportData
    });
    const pdfBuffer = await HybridGenerator.buildPDF({ formattedHTML });
    const pdfFileUrl = await this.saveToBucket({ pdfBuffer });
    return pdfFileUrl;
  }

  async getReportData(paramJSON) {    
    return this._search.search(HybridGenerator.buildRequestJSON(paramJSON));
  }

  static async buildSVG(ESResults) {
    const svgbuilder = new SVGBuilder();
    const searchResult = await svgbuilder.build(ESResults);
    return svgbuilder.build(ESResults);
  }

  static async buildHTML({ searchResults, svgData }) {
    const htmlString = await pdfTemplate({
      svgData,
      tableData: searchResults.aggregations.types_count.buckets
    });
    return htmlString;
  }

  static async buildPDF({ formattedHTML = '' }) {
    const browser = await puppeteer.launch({
      args: chrome.args,
      executablePath: await chrome.executablePath,
      headless: chrome.headless,
    });
    const page = await browser.newPage();
    page.setContent(formattedHTML);
    const buffer = await page.pdf({
      format: 'A4'
    });
    browser.close();
    return buffer;
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
