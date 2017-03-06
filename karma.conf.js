const {resolve} = require('path')
const webpack = require('./webpack.config')


module.exports = function (config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai-sinon'],


    // list of files / patterns to load in the browser
    files: [
      'test/test.js',
      'test/lib/**/*test.ts'
    ],


    preprocessors: {
      // add webpack as preprocessor
      'test/**/*.ts': ['webpack', /*'coverage',*/ 'sourcemap'], // use this for source maps
      'test/**/*.js': ['webpack', /*'coverage',*/ 'sourcemap'], // use this for source maps
    },


    webpack: {
      module: webpack.module,
      resolve: webpack.resolve,
      devtool: 'inline-source-map',
    },



    webpackMiddleware: {
      // webpack-dev-middleware configuration
      // i. e.
      noInfo: true
    },


    browserNoActivityTimeout: 60000, // give webpack more time to build


    // list of files to exclude
    exclude: [],


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha', 'coverage'],


    mochaReporter: {
      showDiff: true
    },


    coverageReporter: {
      type : 'html',
      dir : 'test/coverage/'
    },

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    mime: {
      'text/x-typescript': ['ts','tsx']
    },
  });
};
