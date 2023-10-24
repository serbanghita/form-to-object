const path = require("path");

module.exports = {
  entry: "./src/expose-to-browser.ts",
  output: {
    filename: "formToObject.js",
    path: path.resolve(__dirname, "build")
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: "inline-source-map",

  mode: "development",

  watch: false,

  node: {
    __dirname: true
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
