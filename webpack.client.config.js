const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: path.resolve(__dirname, "packages/client/src/index.tsx"),
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "public"),
    clean: true,
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
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
      },
      {
        test: /\.{tsx|ts}?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx"],
  },
  mode: "production",
  devtool: "source-map",
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "template", "index.html"),
      filename: "index.html",
    }),
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
      chunkFilename: "[id].[contenthash].css",
    }),
  ],
};
