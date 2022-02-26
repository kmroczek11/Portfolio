const webpack = require("webpack");
const ESLintPlugin = require("eslint-webpack-plugin");
const fs = require("fs");
const { resolve } = require("path");

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
          {
            test: /\.js$/,
            loader: "file-replace-loader",
            options: {
              condition: "always", // <-- Note that the rule applies for all files! But you can use other conditions too
              replacement(resourcePath) {
                const mapping = {
                  [resolve(
                    "./node_modules/@react-three/fiber/dist/react-three-fiber.esm.js"
                  )]: resolve("./react-three-fiber.esm.js"),
                  [resolve(
                    "./node_modules/@react-three/fiber/dist/react-three-fiber.cjs.prod.js"
                  )]: resolve("./react-three-fiber.cjs.prod.js"),
                };
                return mapping[resourcePath];
              },
              async: true,
            },
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

  config.plugins.unshift(
    new ESLintPlugin({
      // Plugin options
      extensions: ["js", "mjs", "jsx", "ts", "tsx"],
      formatter: require.resolve("react-dev-utils/eslintFormatter"),
      eslintPath: require.resolve("eslint"),
      context: "./src",
      cache: true,

      // Setting threads to false boost compiling speed back to previous levels
      threads: false,

      // ESLint class options
      cwd: fs.realpathSync(process.cwd()),
      resolvePluginsRelativeTo: __dirname,
      baseConfig: {
        extends: [require.resolve("eslint-config-react-app/base")],
        rules: {
          "react/react-in-jsx-scope": "off",
        },
      },
    })
  );

  return config;
};
