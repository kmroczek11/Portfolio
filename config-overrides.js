/* config-overrides.js */
// const Dotenv = require("dotenv-webpack");

module.exports = function override(config, env) {
  // if (!config.module.rules) {
  //   config.module.rules = [];
  // }
  // config.module.rules = [
  //   {
  //     test: /\.(glsl|vs|fs)$/,
  //     use: [
  //       {
  //         loader: "ts-shader-loader",
  //       },
  //     ],
  //   },
  //   ...config.module.rules,
  // ];

  return config;
};
