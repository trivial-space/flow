var path = require('path'),
    webpack = require('webpack')

module.exports = {

  entry: path.resolve(__dirname, "./lib/index.js"),

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
    }, {
      exclude: /node_modules/,
      loader: 'babel-loader?presets[]=es2015!ts-loader',
      test: /\.ts$/
    }]
  },

  resolve: {
    extensions: ['', '.ts', '.js', '.json'],
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
