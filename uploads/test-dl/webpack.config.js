var args = process.argv
var env = 'development'
if (args.indexOf('--build-production') > 0) {
  env = 'production'
}

var path = require('path')
var nib = require('nib')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HandlebarsHtmlPlugin = require('./lib/handlebars-html-webpack-plugin')
var lessSourceMap = (env != 'production') ? '?sourceMap' : ''
var hash = (env == 'production') ? Date.now() : 'bundle'
var cdn = (env == 'production') ? '//dn-wendax.qbox.me/V3/wendax-pc-frontend' : '/V3'
var templateParams = {env: env, cdn: cdn, hash: hash}
var lintrc = require('./coffeelint')
var _ = require('underscore')


var config = function(name, vendor) {
  var namePath = '/bundles/' + name

  if (name == 'home') {
    namePath = ''
  } else {
    namePath = '/' + name
  }

  var result = {

    name: name,

    entry: {
      app: ['./app/bundles/' + name + '/initialize.coffee'],

      vendor: vendor,
    },

    output: {
      path: __dirname + '/public/V3' + namePath,

      filename: '[name]-'+hash+'.js',

      pathinfo: true,
    },

    module: {
      preLoaders: [{
        test: /\.coffee$/,
        exclude: /node_modules/,
        loader: 'coffeelint-loader'
      },{
        test: /\.styl$/,
        exclude: /node_modules/,
        loader: 'stylint'
      }],
      loaders: [{
        test: /\.coffee$/,
        loader: 'coffee-loader'
      }, {
        test: /\.hbs$/,
        loader: 'handlebars-template-loader',
        query: {
          helperDirs: __dirname + '/app/services/view-helpers'
        }
      }, {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader' + lessSourceMap)
      }, {
        test: /\.styl/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader' + lessSourceMap + '!stylus-loader')
      }, {
        test: /\.jpe?g$|\.gif$|\.png$|\.svg($|\?)|\.eot($|\?)|\.woff($|\?)|\.woff2($|\?)|\.ttf($|\?)|\.html$/,
        loader: 'file-loader',
        query: {
          name: 'assets/[name]-' + hash + '.[ext]'
        }
      }, {
        test: /\.ico$/,
        loader: 'file-loader'
      }],

      unknownContextRegExp: /$^/,
      unknownContextCritical: false,

      exprContextRegExp: /$^/,
      exprContextCritical: false,

      wrappedContextCritical: true,

      noParse: [/moment-with-locales/]
    },

    resolve: {
      root: [__dirname + '/app'],

      extensions: ['', '.coffee', '.js', '.hbs']
    },

    plugins: [
      new ExtractTextPlugin('[name]-'+hash+'.css'),

      new HandlebarsHtmlPlugin({path: __dirname + '/app/bundles/' + name + '/assets/templates', params: templateParams, name: name}),

      new webpack.ContextReplacementPlugin(/chaplin$/, __dirname + '/app/bundles/' + name + '/controllers', false, /^\.\/.*-controller$/),

      new webpack.ProvidePlugin({
          $: 'jquery',
          jQuery: 'jquery',
          Chaplin: 'chaplin',
          _: 'underscore'
      }),

      new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor-' + hash + '.js')
    ],

    cache: false,
    debug: true,

    stats: {
      colors: true
      // children: false
    },

    stylus: {
      use: [nib()]
    },

    coffeelint: lintrc,

    stylint: {
      config: __dirname + '/.stylintrc'
    },

    inline: true
  }

  if (env == 'production') {
    result.plugins.push(new webpack.optimize.DedupePlugin())
    result.plugins.push(new webpack.optimize.UglifyJsPlugin({minimize: true}))
  } else {
    result.devtool = 'source-map'
  }

  return result
}

var bundles = [
  {name: 'home', vendor: ['jquery', 'jquery.cookie']},
  {name: 'account', vendor: ['jquery', 'underscore', 'moment/min/moment-with-locales.min.js']},
  {name: 'dashboard', vendor: [
    'jquery', 'underscore', 'chaplin', 'moment/min/moment-with-locales.min.js',
    'async', 'dragula', 'select2',
    'bootstrap-daterangepicker'
  ]},
  {name: 'share', vendor: ['jquery', 'underscore']}
  // {name: 'mobile', vendor: ['mithril', 'bundles/mobile/assets/styles/base.less']}
]

module.exports = bundles.map(function(item) {
  return config(item.name, item.vendor)
})
