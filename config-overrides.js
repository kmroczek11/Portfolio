const webpack = require("webpack");

class PrintChunksPlugin {
  apply(compiler) {
    compiler.plugin("compilation", (compilation) => {
      compilation.plugin("after-optimize-chunk-assets", (chunks) => {
        console.log(
          chunks.map((chunk) => ({
            id: chunk.id,
            name: chunk.name,
            modules: Array.from(chunk._modules).map((module) => module.id),
          }))
        );
      });
    });
  }
}

module.exports = function override(config, env) {
  config.watchOptions = {
    ignored: /node_modules/,
  };

  config.module.rules = config.module.rules.map((rule) => {
    if (rule.oneOf instanceof Array) {
      return {
        ...rule,
        // create-react-app let every file which doesn't match to any filename test falls back to file-loader,
        // so we need to add a loader before that fallback.
        // see: https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/config/webpack.config.dev.js#L220-L236
        oneOf: [
          {
            test: /\.(glsl|vs|fs)$/,
            loader: "ts-shader-loader",
          },
          ...rule.oneOf,
        ],
      };
    }

    return rule;
  });

  // create-react-app disallows us to import files outside ./src folder.
  // We need to turn this rule off to import files from ./bower_components
  // see: https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/config/webpack.config.dev.js#L112-L119
  if (process.env.NODE_ENV === "development") {
    config.resolve.plugins = [];
  }

  config.plugins = [
    ...config.plugins,
    new webpack.NormalModuleReplacementPlugin(/.*/, function (request) {
      if (request.resource?.includes("@react-three-fiber.esm.js"))
        console.log(request.resource);
      // request.resource = "./react-three-fiber.esm.js";
    }),
    new webpack.NormalModuleReplacementPlugin(
      /\.\/node_modules\/\@react-three\/fiber\/dist\/react-three-fiber\.esm\.js/,
      "./react-three-fiber.esm.js"
      // function (request) {
      //   console.log("found ", request.resource);
      // }
    ),
    // new PrintChunksPlugin(),
  ];

  return config;
};
