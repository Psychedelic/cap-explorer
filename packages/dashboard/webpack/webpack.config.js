const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const webpack = require('webpack');
const pkgJson = require('../../../package.json');

if (!process.env.NODE_ENV) throw Error('Oops! Missing the NODE_ENV environment variable.');

const DEFAULT_DEVELOPMENT_ENVIRONMENT = 'development';
const IS_PROD = process.env.NODE_ENV === 'production';
const IS_STG = process.env.NODE_ENV === 'staging';
const IS_DEV = [DEFAULT_DEVELOPMENT_ENVIRONMENT, 'test'].includes(process.env.NODE_ENV);
const OPT_MAX_ASSET_SIZE = 750000;

// The IC History router id should be passed as an env variable
// in any remote, production or staging environment setup
// e.g process.env.IC_HISTORY_ROUTER_ID = 'aaaaa-aa';

// The MOCKUP env variable is used to force mock data
// e.g. on staging at time of writing the Service is
// not yet available in the mainnet
process.env.MOCKUP = process.env.MOCKUP ?? false;

// Override the IC History Router
// on the development environments
if (IS_DEV) {
  const canisters = require('../../../cap/.dfx/local/canister_ids.json');

  process.env.IC_HISTORY_ROUTER_ID = canisters['ic-history-router'].local;
}

// The IC History router id is required
// when not available the build process is interrupted
if (!process.env.IC_HISTORY_ROUTER_ID) {
  throw Error('Oops! Missing the IC_HISTORY_ROUTER_ID environment variable');
};

// Configuration base settings
let config = {
  entry: path.resolve(__dirname, '../', 'src/index.tsx'),
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|jp2|webp|svg)$/,
        type: 'asset/resource',
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)$/,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    alias: {},
    plugins: [
      new TsconfigPathsPlugin(),
    ],
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../', 'src/index.html'),
      filename: 'index.html',
      favicon: path.resolve(__dirname, '../', 'src/images/favicon.ico'),
    }),
    // DFX slight bug with Buffer in upgrading to 0.7.1
    // this might change, remove after...
    new webpack.ProvidePlugin({
      Buffer: [require.resolve('buffer/'), 'Buffer'],
      process: 'process/browser',
    }),
    new webpack.EnvironmentPlugin([
      'IC_HISTORY_ROUTER_ID',
      'NODE_ENV',
      'MOCKUP',
    ]),
  ],
  output: {
    filename: '[name].[fullhash].js',
    path: path.resolve(__dirname, '../', 'dist'),
    clean: true,
  },
};

// Configuration settings for Prod environments
if (IS_PROD || IS_STG) {
  config = {
    ...config,
    mode: 'production',
    module: {
      rules: [
        {
          test: /\.ts(x?)$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        ...config.module.rules,
      ],
    },
    optimization: {
      nodeEnv: false, 
      minimize: true,
      minimizer: [
        new TerserPlugin({
          test: /\.js(\?.*)?$/i,
        }),
      ],
      splitChunks: {
        chunks: 'all',
        name(module, chunks, cacheGroupKey) {
          const moduleFileName = module
            .identifier()
            .split('/')
            .reduceRight((item) => item);
          const allChunksNames = chunks.map((item) => item.name).join('~');
          return `${cacheGroupKey}-${allChunksNames}-${moduleFileName}-${pkgJson.version.split('.').join('_')}`;
        },
        enforceSizeThreshold: 50000,
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      },
    },
    performance: {
      maxEntrypointSize: OPT_MAX_ASSET_SIZE,
      maxAssetSize: OPT_MAX_ASSET_SIZE,
      // prevent large regressions (fail build)
      hints: 'error',
    },
    plugins: [
      ...config.plugins,
      // Ignore mocks
      new webpack.IgnorePlugin({
        resourceRegExp: /.*\/utils\/mocks\/.*/,
      }),
    ],
  };
}

// Configuration settings for Dev environments
if (IS_DEV) {
  config = {
    ...config,
    mode: 'development',
    module: {
      rules: [
        {
          test: /\.ts(x?)$/,
          exclude: /node_modules/,
          loader: 'esbuild-loader',
          options: {
            loader: 'tsx',
            target: 'es2018',
          },
        },
        ...config.module.rules,
      ],
    },
    devtool: 'inline-source-map',
    devServer: {
      historyApiFallback: true,
      port: 8080,
      open: true,
      hot: true,
      client: {
        overlay: true,
        logging: 'info',
      },
    },
    optimization: {
      nodeEnv: false,
      minimize: false,
    },
    performance: {
      // disable as warnings will be inaccurate
      // due to lack of minification, optimisations, etc
      hints: false,
    },
  };
}

const settingVars = {
  IC_HISTORY_ROUTER_ID: process.env.IC_HISTORY_ROUTER_ID,
  IS_PROD,
  IS_STG,
  IS_DEV,
  OPT_MAX_ASSET_SIZE,
  MOCKUP: process.env.MOCKUP,
};

console.warn(`🤖 Webpack settings under environment ${process.env.NODE_ENV}`);

Object.keys(settingVars).forEach((name) => console.warn(`${name} is ${settingVars[name]}`))

module.exports = config;
