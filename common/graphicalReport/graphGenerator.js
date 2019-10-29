import ESSearch from './search';
import SVGBuilder from './svgbuilder';
import S3Output from './s3-output';

const buildRequestJSON = (paramJSON) => {
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
        time_split: {
          date_histogram: {
            field: 'DateCreated',
            interval: '1h'
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
};

class graphGenerator {
  constructor(ConnectionOptions, bucketName) {
    this._search = new ESSearch(ConnectionOptions);
    this._build = new SVGBuilder();
    this._store = new S3Output(bucketName);
  }

  // Entry Point.
  async generateGraph(paramJSON) {
    const reportData = await this.getReportData(paramJSON);
    const reportSVG = await this.buildGraph(reportData);
    return this.saveToBucket(reportSVG, paramJSON.download);
  }

  // Gets the search results data from ES
  async getReportData(paramJSON) {
    return this._search.search(buildRequestJSON(paramJSON));
  }

  async buildGraph(searchResults) {
    return this._build.build(searchResults);
  }

  // Saves said graph to the S3 Bucket
  async saveToBucket(svgString, downloadMode) {
    this._store.append(svgString);
    return this._store.close(downloadMode);
  }
}

export default graphGenerator;
