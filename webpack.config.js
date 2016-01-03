var path = require('path')
var RewirePlugin = require("rewire-webpack")

module.exports = {

  entry: path.resolve(__dirname, "./lib/index.js"),

  output: {
    path: path.resolve(__dirname, "./build"),
    filename: "tvs-flow.js",
    library: 'tvsFlow',
    libraryTarget: "umd"
  },

  module: {
    loaders: [{
      exclude: /node_modules/,
      loader: 'babel-loader',
      test: /\.js$/,
      query: {
        presets: ['es2015'],
        plugins: ["transform-object-rest-spread"]
      }
    }]
  },

  resolve: {
    extensions: ['', '.js', '.json'],
    root: [
      path.resolve(__dirname, "./lib")
    ]
  },

  plugins: [
    new RewirePlugin()
  ]
}
