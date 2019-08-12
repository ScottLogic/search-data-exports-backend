const formatHeader = (searchResult) => {
  const { hits } = searchResult;

  if (hits && hits.hits.length) {
    return `${Object.keys(hits.hits[0]._source).join(',')}\r\n`;
  }

  return 'NoResults';
};

const formatRows = (searchResult) => {
  const { hits } = searchResult;

  const replacer = (_, value) => {
    if (value === null) return '';
    if (Array.isArray(value)) return value.join(' ');
    return value;
  };

  if (hits && hits.hits.length) {
    const header = Object.keys(hits.hits[0]._source);
    return hits.hits
      .map(row => header.map(fieldName => JSON.stringify(row._source[fieldName], replacer)).join(','))
      .join('\r\n');
  }

  return '';
};

module.exports = {
  formatHeader,
  formatRows
};
