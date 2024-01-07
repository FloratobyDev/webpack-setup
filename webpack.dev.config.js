const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./packages/client/src/index.tsx",
  output: {
    path: path.resolve(__dirname, "public"),
    filename: "bundle.js",
    publicPath: "/",
  },
  devServer: {
    static: path.resolve(__dirname, "public"),
    hot: true,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        secure: false,
        changeOrigin: true,
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: path.resolve(__dirname, "packages", "client", "src"),
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-react",
              [
                "@babel/preset-env",
                {
                  targets: {
                    browsers: ["last 2 versions"],
                  },
                },
              ],
              "@babel/preset-typescript",
            ],
          },
        },
      },
      {
        test: /\.css$/,
        include: path.resolve(__dirname, "packages", "client", "src"),
        exclude: /node_modules/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.{tsx|ts}?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".js", ".tsx", ".ts"],
  },
  devtool: "inline-source-map",
  mode: "development",
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "template", "index.html"),
      filename: "index.html",
    }),
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(false),
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
};
