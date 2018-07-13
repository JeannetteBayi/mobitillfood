let path = require("path");

module.exports = env => {
  return {
    entry: "./src/App.js",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "bundle.js"
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          use: [
            {
              loader: "babel-loader",
              query: {
                presets: ["flow", "react", "es2015", "stage-2"],
                plugins: [
                  "styled-jsx/babel",
                  "inline-react-svg",
                  ["transform-runtime", { "polyfill": false }],
                  "transform-decorators-legacy",
                  "transform-class-properties"
                ]
              }
            }
          ],
          exclude: /node_modules/
        },
        {
          test: /.css$/,
          use: ["style-loader", { loader: "css-loader", query: { url: false } }]
        }
      ]
    },
    devtool: "source-map"
  };
};
