// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

module.exports = {
  entry: "./src/index.ts",
  output: {
    filename: "formToObject.js",
    path: path.resolve(__dirname, "build"),
    // https://webpack.js.org/guides/author-libraries/#expose-the-library
    globalObject: 'this',
    library: {
      name: 'formToObject',
      type: 'umd'
    },
    libraryExport: ['default']
  },

  // target: "web",

  // Enable sourcemaps for debugging webpack's output.
  devtool: "inline-source-map",

  // mode: "development",

  watch: false,

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
