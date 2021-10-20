const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const webpack = require('webpack');

const DEFAULT_DEVELOPMENT_ENVIRONMENT = 'development';
const OPT_MAX_ASSET_SIZE = 500000;

const isProd = process.env.NODE_ENV === 'production';

let config = {
  entry: './src/index.tsx',
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
      template: './src/index.html',
      filename: 'index.html',
      favicon: './src/images/favicon.ico',
    }),
    // DFX slight bug with Buffer in upgrading to 0.7.1
    // this might change, remove after...
    new webpack.ProvidePlugin({
      Buffer: [require.resolve('buffer/'), 'Buffer'],
      process: 'process/browser',
    }),
    new webpack.EnvironmentPlugin({
      // TODO: should use process.env.NODE_ENV
      NODE_ENV: process.env.NODE_ENV || DEFAULT_DEVELOPMENT_ENVIRONMENT,
    }),
  ],
  output: {
    filename: '[name].[fullhash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
};

if (isProd) {
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
      minimize: true,
      minimizer: [
        new TerserPlugin({
          test: /\.js(\?.*)?$/i,
        }),
      ],
      splitChunks: {
        chunks: 'all',
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
} else {
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
            target: 'es2016',
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
      minimize: false,
    },
    performance: {
      // disable as warnings will be inaccurate
      // due to lack of minification, optimisations, etc
      hints: false,
    },
  };
}

module.exports = config;
