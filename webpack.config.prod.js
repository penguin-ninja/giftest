var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var ManifestPlugin = require('webpack-manifest-plugin');
var ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');
var cssnext = require('postcss-cssnext');
var postcssFocus = require('postcss-focus');
var postcssReporter = require('postcss-reporter');
var postcssMedia = require('postcss-custom-media');
var postcssNesting = require('postcss-nesting');
var cssnano = require('cssnano');
var path = require('path');

// initializing env variables for building client
try {
  require('dotenv').config();
} catch (e) {
  console.log('Could not find .env file. Continuing..');
}

module.exports = {
  devtool: 'hidden-source-map',
  entry: {
    app: [
      './client/index.js'
    ],
    vendor: [
      'bootstrap-loader',
      'react',
      'react-dom',
    ]
  },

  output: {
    path: __dirname + '/dist/client/',
    filename: '[name].[chunkhash].js',
    publicPath: '/',
  },

  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      path.resolve('./client'),
      'node_modules',
    ],
  },

  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
            query: {
              modules: true,
              localIdentName: '[hash:base64]',
              importLoaders: 1
            }
          }, {
            loader: 'postcss-loader'
          }]
        })
      }, {
        test: /\.css$/,
        include: /node_modules/,
        loaders: ['style-loader', 'css-loader'],
      }, {
        test: /\.jsx*$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      }, {
        test: /\.(jpe?g|gif|png|svg|woff|woff2|ttf|eot)$/i,
        loader: 'url-loader?limit=10000',
      }, {
        test: /\.json$/,
        loader: 'json-loader',
      }
    ],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
        SITE_URL: JSON.stringify(process.env.SITE_URL)
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: Infinity,
      filename: 'vendor.js',
    }),
    new ExtractTextPlugin({
      filename: 'app.[contenthash].css',
      allChunks: true
    }),
    new ManifestPlugin({
      basePath: '/',
    }),
    new ChunkManifestPlugin({
      filename: "chunk-manifest.json",
      manifestVariable: "webpackManifest",
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false,
      }
    }),
    new webpack.ProvidePlugin({
        jQuery: 'jquery'
    }),
    new webpack.LoaderOptionsPlugin({
      options: {
        postcss: () => [
          postcssFocus(),
          postcssNesting(),
          postcssMedia({
            extensions: {
              '--phone-xs': '(max-width: 480px) and (min-width: 320px)',
              '--phone-sm': '(max-width: 568px)',
              '--phone-md': '(max-width: 767px) and (min-width: 569px)',
              '--tablet': '(min-width: 768px)',
              '--desktop': '(min-width: 992px)',
              '--large-desktop': '(min-width: 1200px)',
            }
          }),
          cssnext({
            browsers: ['last 2 versions', 'IE > 10'],
          }),
          cssnano({
            autoprefixer: false
          }),
          postcssReporter({
            clearMessages: true,
          }),
        ]
      }
    })
  ],
};
