const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const isProduction = process.env.NODE_ENV == "production";

const stylesHandler = isProduction
  ? MiniCssExtractPlugin.loader
  : "style-loader";

const config = module.exports = {
    entry: {
        main: path.resolve(__dirname, './src/index.js'),
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'main.bundle.js',
    },
    devServer: {
        open: true,
        host: "localhost",
      },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './src/index.html'), 
            filename: 'index.html',
            minify: false,
        }),
        new CleanWebpackPlugin(),
    ],
    module: {
        rules: [
          {
            test: /\.(js|jsx)$/i,
            loader: "babel-loader",
          },
          {
            test: /\.s[ac]ss$/i,
            use: [stylesHandler, "css-loader", "postcss-loader", "sass-loader"],
          },
          {
            test: /\.css$/i,
            use: [stylesHandler, "css-loader", "postcss-loader"],
          },
          {
            test: /\.(woff(2)?|eot|ttf|otf)$/i,
            type: 'asset/resource',
            generator: {
              filename: 'assets/fonts/[name][ext]',
            },
          },
          {
            test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
            type: "asset",
          },
        ],
      },
}

module.exports = () => {
    if (isProduction) {
      config.mode = "production";
  
      config.plugins.push(new MiniCssExtractPlugin());
    } else {
      config.mode = "development";
    }
    return config;
  };