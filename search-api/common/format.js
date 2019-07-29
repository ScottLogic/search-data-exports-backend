/* This Class is responsible for converting a Elastic Search result
into a pre-defined json format to return to the client. */
const STATUS_OK = 'ok';
const STATUS_WARN = 'warn';
const STATUS_ERROR = 'error';

const makeResult = result => ({
  uuid: result._id,
  Type: result._index,
  ...result._source
});

const getStatus = (timedOut, _shards) => {
  if (timedOut) return STATUS_ERROR;
  if (_shards.total !== _shards.successful) return STATUS_WARN;
  return STATUS_OK;
};

const getStatusMessage = (timedOut, _shards) => {
  if (timedOut) return 'Request Timed Out';
  if (_shards.total !== _shards.successful) {
    return `Request shards missmatch, status [ success: ${_shards.successful}, skipped: ${
      _shards.skipped
    }, failed: ${_shards.failed}]`;
  }
  return '';
};

const formatResults = results => (!results.hits
  ? {
    Status: STATUS_ERROR,
    ErrorMessage: 'No Return Information Found'
  }
  : {
    Status: getStatus(results.timed_out, results._shards),
    ErrorMessage: getStatusMessage(results.timed_out, results._shards),
    TotalResults: results.hits.total || 0,
    ResultsCount: results.hits.hits.length || 0,
    Results: results.hits.hits.map(result => makeResult(result))
  }
);

module.exports = formatResults;
