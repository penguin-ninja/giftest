var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var ManifestPlugin = require('webpack-manifest-plugin');
var ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');
var cssnext = require('postcss-cssnext');
var postcssFocus = require('postcss-focus');
var postcssReporter = require('postcss-reporter');
var cssnano = require('cssnano');
var path = require('path');

module.exports = {
  devtool: 'hidden-source-map',
  entry: {
    app: [
      'bootstrap-loader',
      './client/index.js',
    ],
    vendor: [
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
    extensions: ['', '.js', '.jsx'],
    modules: [
      path.resolve('./client'),
      'node_modules',
    ],
  },

  module: {
    loaders: [
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader?localIdentName=[hash:base64]&modules&importLoaders=1!postcss-loader'),
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
    new ExtractTextPlugin('app.[chunkhash].css', { allChunks: true }),
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
