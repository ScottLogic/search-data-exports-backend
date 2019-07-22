const ESSearch = require(`./common/search.js`);

class graphGenerator {

    constructor(ConnectionOptions) {
        this._search = new ESSearch(ConnectionOptions);
    }

    // Entry Point
    async generateGraph( paramJSON = {} ) {
        const reportData = await this.getReportData(paramJSON);                
        return reportData;
    }

    // Gets the date from ES
    async getReportData( paramJSON ) {             
        return await this._search.search(this.buildRequestJSON(paramJSON));
    }

    async buildGraph() {

    }

    // Saves said graph to the S3 Bucket
    async saveToBucket() {

    }


    /* @TODO : Move these somewhere else? they are special for each report so might be best seperate. */
    // The JSON requiest needed for this report 
    buildRequestJSON( paramJSON = {} ) {

        const dateRange = paramJSON.search.find( x => x.dateRange); // pull out the date range from params        
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
