const slsw = require('serverless-webpack');

module.exports = {
  entry: slsw.lib.entries,
  target: 'node',
  optimization: {
    minimize: false
  },
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production'
};
