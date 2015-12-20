var path = require('path')
var RewirePlugin = require("rewire-webpack")

module.exports = {

  entry: path.resolve(__dirname, "./lib/index"),

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
        presets: ['es2015']
      }
    }]
  },

  resolve: {
    extensions: ['', '.js', '.json', '.coffee'],
    root: [
      path.resolve(__dirname, "./lib")
    ]
  },

  plugins: [
    new RewirePlugin()
  ]
}
