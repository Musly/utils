const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const webpack = require('webpack');

const ENV = process.env.NODE_ENV || 'development';
const IS_DEV = ENV === 'development';
const IS_PROD = ENV === 'production';
const IS_TEST = ENV === 'test';

module.exports = {
  mode: ENV,
  target: ['web', 'es5'],

  entry: {
    app: './src/index.jsx',
  },

  output: {
    filename: IS_DEV ? '[name].js' : '[name].[contenthash].js',
    chunkFilename: IS_DEV ? '[name].js' : '[name].[contenthash].js',
    publicPath: '/',
    path: path.resolve(process.cwd(), 'build'),
  },

  resolve: {
    extensions: ['.json', '.js', '.jsx', '.css'],
  },

  module: {
    strictExportPresence: true,

    rules: [
      { // Disable require.ensure as it's not a standard language feature.
        test: /\.(js|jsx)$/,
        parser: { requireEnsure: false },
      },
      {
        loader: 'file-loader',
        test: /\.(svg|ttf|eot|woff|woff2|gif|jpg|jpeg|bmp)$/,
        options: {
          outputPath: 'assets',
          name: IS_DEV ? '[name].[ext]' : '[name].[contenthash:8].[ext]',
        },
      },
      {
        test: /\.css$/,
        use: [
          IS_DEV ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: IS_DEV,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: IS_DEV,
            },
          },
        ],
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
      },
      // Process any JS outside of the app with Babel.
      // Unlike the application JS, we only compile the standard ES features.
      // This has to STAY until we drop support for IE11
      {
        test: /\.(js|jsx)$/,
        exclude: /@babel(?:\/|\\{1,2})runtime/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              configFile: false,
              compact: false,
              cacheDirectory: path.resolve(process.cwd(), '.cache-loader'),
              cacheCompression: false,
              // Babel assumes ES Modules, which isn't safe until CommonJS
              // dies. This changes the behavior to assume CommonJS unless
              // an `import` or `export` is present in the file.
              // https://github.com/webpack/webpack/issues/4039#issuecomment-419284940
              sourceType: 'unambiguous',
              presets: [
                IS_TEST && ['@babel/preset-env', {
                  targets: {
                    node: 'current',
                  },
                  // Exclude transforms that make all code slower
                  exclude: ['transform-typeof-symbol'],
                }],
                (IS_DEV || IS_PROD) && ['@babel/preset-env', {
                // Allow importing core-js in entrypoint and use browserlist to select polyfills
                  useBuiltIns: 'entry',
                  // Set the corejs version we are using to avoid warnings in console
                  // This will need to change once we upgrade to corejs@3
                  corejs: { version: 3 },
                  // Exclude transforms that make all code slower
                  exclude: ['transform-typeof-symbol'],
                }],
              ].filter(Boolean),
              plugins: [
                ['@babel/plugin-transform-runtime', {
                  corejs: false,
                  helpers: true,
                  // eslint-disable-next-line global-require
                  version: require('@babel/runtime/package.json').version,
                  regenerator: true,
                  // https://babeljs.io/docs/en/babel-plugin-transform-runtime#useesmodules
                  // We should turn this on once the lowest version of Node LTS
                  // supports ES Modules.
                  useESModules: IS_DEV || IS_PROD,
                  // Undocumented option that lets us encapsulate our runtime, ensuring
                  // the correct version is used
                  // https://github.com/babel/babel/blob/090c364a90fe73d36a30707fc612ce037bdbbb24/packages/babel-plugin-transform-runtime/src/index.js#L35-L42
                  absoluteRuntime: require.resolve('@babel/runtime/package.json'),
                }],
              ],
            },
          },
        ].filter(Boolean),
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              configFile: path.resolve(process.cwd(), 'babel.config.js'),
              cacheDirectory: path.resolve(process.cwd(), '.cache-loader'),
              cacheCompression: false,
            },
          },
        ].filter(Boolean),
      },
    ],
  },

  plugins: [
    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(ENV),
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(process.cwd(), 'public', 'assets'),
          to: path.resolve(process.cwd(), 'build', 'assets'),
          noErrorOnMissing: true,
        },
        {
          from: path.resolve(process.cwd(), 'public', 'browserconfig.xml'),
          to: path.resolve(process.cwd(), 'build'),
          noErrorOnMissing: true,
        },
        {
          from: path.resolve(process.cwd(), 'public', 'manifest.json'),
          to: path.resolve(process.cwd(), 'build'),
          noErrorOnMissing: true,
        },
      ],
    }),
    new HtmlWebpackPlugin({
      filename: path.resolve(process.cwd(), 'build', 'index.html'),
      template: path.resolve(process.cwd(), 'public', 'index.html'),
      inject: 'body',
      cache: false,
    }),
    new MiniCssExtractPlugin({
      filename: IS_DEV ? 'style.css' : 'style.[hash].css',
      chunkFilename: IS_DEV ? '[id].css' : '[id].[chunkhash].css',
    }),
    IS_DEV && new ReactRefreshWebpackPlugin({
      exclude: [/node_modules/],
    }),
    IS_DEV && new CircularDependencyPlugin({
      exclude: /node_modules/,
      onDetected ({ paths, compilation }) {
        compilation.errors.push(new Error(paths.join(' -> ')));
      },
    }),
  ].filter(Boolean),

  devtool: process.env.SOURCE_MAP || 'source-map',

  devServer: {
    historyApiFallback: true,
    static: path.resolve(process.cwd(), 'build'),
    host: process.env.HOST || '0.0.0.0',
    port: process.env.PORT || 80,
    dev: {
      publicPath: '/',
    },
  },

  performance: {
    hints: IS_DEV ? false : 'warning',
  },

  watchOptions: {
    ignored: /node_modules/,
  },

  optimization: {
    usedExports: true,
    sideEffects: true,
    concatenateModules: true,
    nodeEnv: process.env.NODE_ENV,
    removeAvailableModules: true,
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'common',
          priority: -10,
        },
      },
    },
    minimizer: [
      new TerserPlugin({
        parallel: true,
        extractComments: false,
        terserOptions: {
          parse: {
            ecma: 8,
            shebang: false,
          },
          ecma: 5,
          keep_classnames: false,
          keep_fnames: false,
          mangle: true,
          sourceMap: false,
          safari10: false,
          toplevel: false,
          warnings: false,
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
          compress: {
            ecma: 5,
            passes: 3,
            keep_fargs: false,
            comparisons: false,
            warnings: false,
            inline: 2,
          },
        },
      }),
    ],
  },
};
