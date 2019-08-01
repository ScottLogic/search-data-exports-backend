const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: slsw.lib.entries,
  target: 'node',
  optimization: {
    minimize: false
  },
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  externals: [nodeExternals()]
};
