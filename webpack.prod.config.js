const path = require('path');
const fs = require('fs');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const {EnvironmentPlugin} = require('webpack');

const DIST = path.resolve(__dirname, 'public');

// eslint-disable-next-line node/no-sync
const appDirectory = fs.realpathSync(process.cwd(), 'utf8');
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);
// eslint-disable-next-line import/no-dynamic-require
const prefix = require(resolveApp('package.json')).homepage;
module.exports = (_, argv) => {
  const config = {
    mode: 'production',
    devtool: 'source-map',
    entry: './src/index.tsx',
    output: {
      filename: 'bundle.js',
      path: DIST,
      publicPath: '/',
    },
    plugins: [
      new HtmlWebpackPlugin({
        publicPath: prefix,
        template: 'template/index.html',
      }),
      new NodePolyfillPlugin({
        excludeAliases: ['stream', 'buffer'],
      }),
      new EnvironmentPlugin({
          NODE_ENV: 'production',
          REACT_APP_HEADSUP_FRONTEND_URI:'',
          REACT_APP_HEADSUP_ENV:'',
          REACT_APP_HEADSUP_MAIN_CONTRACT_ID:'',
          REACT_APP_HEADSUP_IPFS_GATEWAY:''
      })
    ],
    module: {
      rules: [
        {
          test: /\.tsx?$/u,
          use: 'ts-loader',
          exclude: /node_modules/u,
        },
        {
          test: /\.css$/u,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/u,
          type: 'asset/resource',
        },
      ],
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js', '.json'],
      fallback: {
        // eslint-disable-next-line node/no-extraneous-require
        buffer: require.resolve('buffer-browserify'),
        stream: require.resolve('stream-browserify'),
      },
    },
  };
  return config;
};
