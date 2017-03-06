const {resolve} = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')


module.exports = {

  entry: resolve(__dirname, "lib", "index.ts"),

  output: {
    path: resolve(__dirname, "dist"),
    filename: "tvs-flow.js",
    library: 'tvsFlow',
    libraryTarget: "umd"
  },

  module: {
    rules: [{
      exclude: /node_modules/,
      use: 'ts-loader',
      test: /\.ts$/
    }]
  },

  resolve: {
    extensions: ['.ts', '.js', '.json'],
    modules: [
      'node_modules',
      resolve(__dirname, "lib")
    ]
  },

  plugins: [
    new UglifyJsPlugin({
      beautify: true
    })
  ]
}
