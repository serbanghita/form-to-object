// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: "./src/index.ts",
  output: {
    filename: "formToObject.min.js",
    path: path.resolve(__dirname, "build/bundle"),
    // https://webpack.js.org/guides/author-libraries/#expose-the-library
    globalObject: 'this',
    library: {
      name: 'formToObject',
      type: 'umd'
    },
    libraryExport: ['default']
  },

  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },

  resolve: {
    extensions: [".ts"]
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
        exclude: /node_modules/
      },

      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
    ]
  }
};
