// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

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
    ]
  }
};
