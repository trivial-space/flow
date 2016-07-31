var path = require('path'),
    webpack = require('webpack')

module.exports = {

  entry: path.resolve(__dirname, "./lib/runtime.js"),

  output: {
    path: path.resolve(__dirname, "./dist"),
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
        plugins: [
          "transform-object-rest-spread",
          "add-module-exports"
        ]
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
    new webpack.optimize.UglifyJsPlugin({
      beautify: true
    })
  ]
}
