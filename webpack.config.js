const path = require('path');
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    //filename: 'index.js',
    //library: 'esreact',
    //libraryTarget: 'umd', //'var' , 'umd'
    //clean: true
    //globalObject: 'this',
  },
  resolve: {
    modules: [path.resolve(__dirname, 'node_modules'), 'node_modules']
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        extractComments: false,
        //sourceMap: true, // Must be set to true if using source-maps in production
        terserOptions: {
          compress: {
            drop_console: false,
          },
          format: {
            comments: false,
          },
        },
      }),
    ],
  },
  module: {
    rules: [
      {
        test:  /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',

        },
      },
      {
        test: /\.css$/i,
        include: path.resolve(__dirname, 'src'),
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: 'file-loader'
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: './index.html',
    }),
  ],
  devServer: {
    port: 3000,
    open: true,
  },
};