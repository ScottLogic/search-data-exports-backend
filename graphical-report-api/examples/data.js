const data = {
  took: 6,
  timed_out: false,
  _shards: {
    total: 1,
    successful: 1,
    skipped: 0,
    failed: 0
  },
  hits: {
    total: { value: 2000, relation: 'eq' },
    max_score: null,
    hits: []
  },
  aggregations: {
    time_split: {
      buckets: [
        {
          key_as_string: '2019-07-21T00:00:00.000Z',
          key: 1563667200000,
          doc_count: 27
        },
        {
          key_as_string: '2019-07-21T01:00:00.000Z',
          key: 1563670800000,
          doc_count: 25
        },
        {
          key_as_string: '2019-07-21T02:00:00.000Z',
          key: 1563674400000,
          doc_count: 23
        },
        {
          key_as_string: '2019-07-21T03:00:00.000Z',
          key: 1563678000000,
          doc_count: 18
        },
        {
          key_as_string: '2019-07-21T04:00:00.000Z',
          key: 1563681600000,
          doc_count: 16
        },
        {
          key_as_string: '2019-07-21T05:00:00.000Z',
          key: 1563685200000,
          doc_count: 20
        },
        {
          key_as_string: '2019-07-21T06:00:00.000Z',
          key: 1563688800000,
          doc_count: 23
        },
        {
          key_as_string: '2019-07-21T07:00:00.000Z',
          key: 1563692400000,
          doc_count: 27
        },
        {
          key_as_string: '2019-07-21T08:00:00.000Z',
          key: 1563696000000,
          doc_count: 23
        },
        {
          key_as_string: '2019-07-21T09:00:00.000Z',
          key: 1563699600000,
          doc_count: 21
        },
        {
          key_as_string: '2019-07-21T10:00:00.000Z',
          key: 1563703200000,
          doc_count: 20
        },
        {
          key_as_string: '2019-07-21T11:00:00.000Z',
          key: 1563706800000,
          doc_count: 21
        },
        {
          key_as_string: '2019-07-21T12:00:00.000Z',
          key: 1563710400000,
          doc_count: 16
        },
        {
          key_as_string: '2019-07-21T13:00:00.000Z',
          key: 1563714000000,
          doc_count: 16
        },
        {
          key_as_string: '2019-07-21T14:00:00.000Z',
          key: 1563717600000,
          doc_count: 24
        },
        {
          key_as_string: '2019-07-21T15:00:00.000Z',
          key: 1563721200000,
          doc_count: 14
        },
        {
          key_as_string: '2019-07-21T16:00:00.000Z',
          key: 1563724800000,
          doc_count: 24
        },
        {
          key_as_string: '2019-07-21T17:00:00.000Z',
          key: 1563728400000,
          doc_count: 19
        },
        {
          key_as_string: '2019-07-21T18:00:00.000Z',
          key: 1563732000000,
          doc_count: 26
        },
        {
          key_as_string: '2019-07-21T19:00:00.000Z',
          key: 1563735600000,
          doc_count: 23
        },
        {
          key_as_string: '2019-07-21T20:00:00.000Z',
          key: 1563739200000,
          doc_count: 13
        },
        {
          key_as_string: '2019-07-21T21:00:00.000Z',
          key: 1563742800000,
          doc_count: 18
        },
        {
          key_as_string: '2019-07-21T22:00:00.000Z',
          key: 1563746400000,
          doc_count: 13
        },
        {
          key_as_string: '2019-07-21T23:00:00.000Z',
          key: 1563750000000,
          doc_count: 20
        },
        {
          key_as_string: '2019-07-22T00:00:00.000Z',
          key: 1563753600000,
          doc_count: 64
        },
        {
          key_as_string: '2019-07-22T01:00:00.000Z',
          key: 1563757200000,
          doc_count: 58
        },
        {
          key_as_string: '2019-07-22T02:00:00.000Z',
          key: 1563760800000,
          doc_count: 64
        },
        {
          key_as_string: '2019-07-22T03:00:00.000Z',
          key: 1563764400000,
          doc_count: 56
        },
        {
          key_as_string: '2019-07-22T04:00:00.000Z',
          key: 1563768000000,
          doc_count: 64
        },
        {
          key_as_string: '2019-07-22T05:00:00.000Z',
          key: 1563771600000,
          doc_count: 59
        },
        {
          key_as_string: '2019-07-22T06:00:00.000Z',
          key: 1563775200000,
          doc_count: 71
        },
        {
          key_as_string: '2019-07-22T07:00:00.000Z',
          key: 1563778800000,
          doc_count: 68
        },
        {
          key_as_string: '2019-07-22T08:00:00.000Z',
          key: 1563782400000,
          doc_count: 61
        },
        {
          key_as_string: '2019-07-22T09:00:00.000Z',
          key: 1563786000000,
          doc_count: 58
        },
        {
          key_as_string: '2019-07-22T10:00:00.000Z',
          key: 1563789600000,
          doc_count: 51
        },
        {
          key_as_string: '2019-07-22T11:00:00.000Z',
          key: 1563793200000,
          doc_count: 66
        },
        {
          key_as_string: '2019-07-22T12:00:00.000Z',
          key: 1563796800000,
          doc_count: 53
        },
        {
          key_as_string: '2019-07-22T13:00:00.000Z',
          key: 1563800400000,
          doc_count: 69
        },
        {
          key_as_string: '2019-07-22T14:00:00.000Z',
          key: 1563804000000,
          doc_count: 76
        },
        {
          key_as_string: '2019-07-22T15:00:00.000Z',
          key: 1563807600000,
          doc_count: 71
        },
        {
          key_as_string: '2019-07-22T16:00:00.000Z',
          key: 1563811200000,
          doc_count: 62
        },
        {
          key_as_string: '2019-07-22T17:00:00.000Z',
          key: 1563814800000,
          doc_count: 72
        },
        {
          key_as_string: '2019-07-22T18:00:00.000Z',
          key: 1563818400000,
          doc_count: 60
        },
        {
          key_as_string: '2019-07-22T19:00:00.000Z',
          key: 1563822000000,
          doc_count: 53
        },
        {
          key_as_string: '2019-07-22T20:00:00.000Z',
          key: 1563825600000,
          doc_count: 69
        },
        {
          key_as_string: '2019-07-22T21:00:00.000Z',
          key: 1563829200000,
          doc_count: 61
        },
        {
          key_as_string: '2019-07-22T22:00:00.000Z',
          key: 1563832800000,
          doc_count: 61
        },
        {
          key_as_string: '2019-07-22T23:00:00.000Z',
          key: 1563836400000,
          doc_count: 63
        }
      ]
    }
  }
};

module.exports = data;
