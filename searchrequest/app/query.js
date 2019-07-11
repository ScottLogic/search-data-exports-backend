/*
This code is responsible to making ES queries from the JSON inputted, as we want to hide some of the nitty gritty from the users. 
*/
const SEARCH_FIELDS_USER = ["LastName","FirstName", "EmailAddress"];
const SEARCH_FIELDS_POST = [ "Content","Tags^3" ] ; // The ^3 makes tags 3 times more important that content. 

class QuerryGenerator {

   buildFilters( type , dateRange = []  ) {              
       let filterList = [];
       type && filterList.push({"term" : {"_type":type}} );
       if (dateRange.length === 2)  {
        filterList.push({ "range": { "DateCreated": { "gte": dateRange[0] }}});
        filterList.push({ "range": { "DateCreated": { "lte": dateRange[1] }}});
       } 
       return filterList;
   }

   buildQuery( type, searchFilters ) {
    let queryList = [];

    for (let filter of searchFilters) {
        switch (filter.field) {
            case 'all' : 
                queryList.push(this.makeMultiFieldQuery(type,filter.value));
                break;
            default:
                queryList.push(this.makeTermQuery(filter.field,filter.value)); 
        } 
    }
    return queryList;
   }

   makeMultiFieldQuery( type, queryData) {
        return { 
            "multi_match": { 
                "query": queryData,  
                "fields": this.getFieldList(type)
            } 
        };
   }

   makeTermQuery( field, value) {
        return { 
            "match": { [`${field}`] : value } 
        };
    }

   getFieldList(type) {
       switch(type) {
           case 'post': return SEARCH_FIELDS_POST;
           case 'user': return SEARCH_FIELDS_USER;
           default: return [ ...SEARCH_FIELDS_POST , ...SEARCH_FIELDS_USER];
       }
   }

    buildQueryJson( rawRequest = {} , method  ) {
        const resultsSize = (rawRequest.resultSize) ? rawRequest.resultSize : 10;        
        // The only filters we care about are type, and dateRange. everything else is actual scored filters.
        const dateRange = rawRequest.search.find( x => x.dateRange);       
        const filtersList = this.buildFilters(  (method) ? method : rawRequest.type, (dateRange) ? dateRange.dateRange : []  );
        const queryList = this.buildQuery(  (method) ? method : rawRequest.type, rawRequest.search.filter( x => !(x.dateRange)));        
        
        let returnJSON = {
            "query": { 
                "bool": {
                    "must": queryList,
                    "filter": filtersList
                }
            },
            "size" : resultsSize,
            "from": (rawRequest.page) ? rawRequest.page * resultsSize : 0
        }        

        return returnJSON;
    }
}

module.exports = QuerryGenerator;