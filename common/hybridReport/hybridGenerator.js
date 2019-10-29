import chrome from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';
import ESSearch from './search';
import SVGBuilder from './svgbuilder';
import S3Output from './s3-output';
import pdfTemplate from './htmlbase';

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
    await page.setContent(formattedHTML);
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

  static buildRequestJSON(paramJSON) {
    let dateRange;
    if (Object.prototype.hasOwnProperty.call(paramJSON, 'search')) {
      dateRange = paramJSON.search.find(x => x.dateRange);
    } else {
      dateRange = [Date.now() - 1, Date.now()];
    }
    const startDate = new Date(dateRange[0]);
    const endDate = new Date(dateRange[1]);

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

export default HybridGenerator;
