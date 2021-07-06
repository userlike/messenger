/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

const path = require("path");

/** @type {import('webpack').Configuration} */
const config = {
  entry: "./dist/es/index.js",
  mode: "production",
  output: {
    path: path.resolve(__dirname, "dist/browser"),
    filename: "index.min.js",
    library: {
      name: {
        root: "UserlikeMessenger",
        commonjs: "messenger",
        amd: "userlike-messenger",
      },
      type: "umd",
      umdNamedDefine: true,
    },
    globalObject: `typeof window !== 'undefined' ? window : this`,
  },
};

module.exports = config;
