class CSVFormatter {
  formatHeader( searchResult ) {
    let hits = searchResult.hits;

    if (hits && hits.hits.length) {
      return Object.keys(hits.hits[0]._source).join(',');
    }

    return 'NoResults';
  }

  formatRows( searchResult ) {
    const header = this.formatHeader(searchResult);
    let hits = searchResult.hits;

    const replacer = (key, value) => value === null ? '' : value 

    if (hits && hits.hits.length) {
      let header = Object.keys(hits.hits[0]._source);
      return hits.hits.map(row => header.map(fieldName => JSON.stringify(row._source[fieldName], replacer)).join(',')).join('\r\n');
    }

    return '';
  }

}

module.exports = CSVFormatter;