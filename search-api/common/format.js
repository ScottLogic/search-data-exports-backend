/**
 * This Class is responsible for converting a Elastic Search result into a pre-defined json format to return to the client. 
 */
const STATUS_OK = "ok";
const STATUS_WARN = "warn";
const STATUS_ERROR = "error";

class Format {

    formatResults( results) {         
        
        if (!results.hits) {
            return {
                "status": STATUS_ERROR,
                "errorMessage" : "No Return Information Found"
            };
        }

        return {
            "status": this.getStatus(results.timed_out,results._shards),
            "errorMessage" : this.getStatusMessage(results.timed_out,results._shards),
            "TotalResults" : (results.hits.total) ? results.hits.total: 0,
            "ResultsCount" : results.hits.hits.length,
            "Results" : results.hits.hits.map( result => this.makeResult(result))
        };
    }

    makeResult( result ) {
        return {
            "uuid" : result._id,
            "type" : result._index,
            ...result._source
        }
    }

    getStatus( timed_out, _shards ) {
        if (timed_out) return STATUS_ERROR ;
        if (_shards.total !== _shards.successful) return STATUS_WARN;
        return STATUS_OK;
    }

    getStatusMessage( timed_out, _shards ) {
        if (timed_out) return "Request Timed Out" ;
        if (_shards.total !== _shards.successful) return `Request shards missmatch, status [ success: ${_shards.successful}, skipped: ${_shards.skipped}, failed: ${_shards.failed}]`;
        return "";
    }

};

module.exports = Format;