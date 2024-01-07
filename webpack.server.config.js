const path = require("path");
const nodeExternals = require("webpack-node-externals");
const webpack = require("webpack");

module.exports = {
  entry: path.resolve(__dirname, 'packages/server/index.ts'),
  output: {
    filename: "server.js",
    path: path.join(__dirname, "dist"),
  },
  target: "node",
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  devtool: "source-map",
  mode: "production",
};
