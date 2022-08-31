const path = require('path');
const fs = require('fs');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {EnvironmentPlugin} = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const DIST = path.resolve(__dirname, 'public');

// eslint-disable-next-line node/no-sync
const appDirectory = fs.realpathSync(process.cwd(), 'utf8');
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);
// eslint-disable-next-line import/no-dynamic-require
const prefix = require(resolveApp('package.json')).homepage;

module.exports = (_, argv) => {
  const isProd = argv.mode === 'production';
  console.log(isProd);
  const config = {
    devtool: 'inline-source-map',
    mode: 'development',
    entry: './src/index.tsx',
    output: {
      filename: 'bundle.js',
      path: DIST,
      publicPath: DIST,
    },
    devServer: {
      contentBase: DIST,
      port: 9011,
      historyApiFallback: { index: '/', disableDotRule: true },
      writeToDisk: true,
    },
    plugins: [
      new HtmlWebpackPlugin({
        publicPath: isProd ? prefix : '/',
        template: 'template/index.html',
      }),
      new NodePolyfillPlugin({
        excludeAliases: ['stream', 'buffer'],
      }),
      new EnvironmentPlugin({

          NODE_ENV: 'development',
          REACT_APP_HEADSUP_FRONTEND_URI:'',
          REACT_APP_HEADSUP_ENV:'',
          REACT_APP_HEADSUP_MAIN_CONTRACT_ID:'0x9Fa0424f8276C9544048C194161B265807414Be4',
          REACT_APP_HEADSUP_IPFS_GATEWAY:''
      })
     /* new EnvironmentPlugin([
        'NODE_ENV', 
        'REACT_APP_HEADSUP_FRONTEND_URI',
        'REACT_APP_HEADSUP_ENV',
        'REACT_APP_HEADSUP_MAIN_CONTRACT_ID',
        'REACT_APP_HEADSUP_IPFS_GATEWAY'
    ])*/
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
