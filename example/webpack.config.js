// http://necolas.github.io/react-native-web/docs/?path=/docs/guides-multi-platform--page#web-packaging-for-existing-react-native-apps

const path = require("path");
const fromRoot = (_) => path.resolve(__dirname, _);

const isProd = process.env.NODE_ENV === "production";

module.exports = {
  mode: isProd ? "production" : "development",
  entry: fromRoot("index.js"),
  output: {
    path: fromRoot("dist"),
    filename: "bundle.web.js",
  },
  devServer: {
    static: { directory: fromRoot("dist") },
    devMiddleware: { publicPath: "/" },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        use: { loader: "babel-loader" },
        include: [fromRoot("index.js"), fromRoot("src")],
      },
    ],
  },
  resolve: {
    alias: { "react-native$": "react-native-web" },
    extensions: [".ts", ".tsx", ".js", ".jsx", ".json"]
      .map((extension) => [".web" + extension, extension])
      .flat(),
  },
};
