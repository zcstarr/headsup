const path = require('path');
const fs = require('fs');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
