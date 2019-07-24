const ESSearch = require(`./common/search`);
const SVGBuilder = require(`./common/svgbuilder`);
const S3Output = require(`./common/s3-output`);

class graphGenerator {

    constructor(ConnectionOptions , bucketName) {
        this._search = new ESSearch(ConnectionOptions);
        this._build = new SVGBuilder();
        this._store = new S3Output(bucketName);
    }

    // Entry Point. 
    async generateGraph( paramJSON = {} ) {
        const reportData = await this.getReportData(paramJSON); 
        const reportSVG = await this.buildGraph(reportData);
        return await this.saveToBucket(reportSVG);        
    }

    // Gets the date from ES
    async getReportData( paramJSON ) {             
        return await this._search.search(this.buildRequestJSON(paramJSON));
    }

    async buildGraph( searchResults ) {
        return await this._build.build(searchResults);                
    }

    // Saves said graph to the S3 Bucket
    async saveToBucket( svgString ) {
        this._store.append(svgString);
        return await this._store.close();
    }

    /* @TODO : Move these somewhere else? they are special for each report so might be best seperate. */    
    buildRequestJSON( paramJSON = {} ) {

        const dateRange = paramJSON.search.find( x => x.dateRange); 
        let  startDate = new Date(dateRange ? dateRange.dateRange[0] : Date.now() );
        const endDate = new Date( dateRange ? dateRange.dateRange[1] : Date.now() );
        !dateRange && startDate.setDate(startDate.getDate() - 1);             
        
        return {
            "index": "posts",
            "size": 0,
            "body" : {
                "aggs": {
                    "time_split" : {
                        "date_histogram" : {
                            "field": "DateCreated",
                            "interval": "1h"
                        }
                    }
                },
                "query" : {
                    "bool" : {
                        "filter" : [
                            { "range" : { 
                                "DateCreated": { 
                                    "gte": `${startDate.toISOString()}`
                                    } 
                                } 
                            },
                            { "range" : { 
                                "DateCreated": { 
                                    "lte": `${endDate.toISOString()}`
                                    } 
                                } 
                            }
                        ]
                    }
                }
            }
        };
    }   

    buildFilters( dateRange = []  ) {              
        let filterList = [];        
        if (dateRange.length >= 1) filterList.push({ "range": { "DateCreated": { "gte": dateRange[0] }}});
        if (dateRange.length >= 2) filterList.push({ "range": { "DateCreated": { "lte": dateRange[1] }}});    
        return filterList;
    }

}

module.exports = graphGenerator;
