const path = require("path");

function isSourceFileRule(rule) {
  if (!rule.test) return false;
  const testStr = rule.test.toString();
  return (
    (testStr.includes("js") ||
      testStr.includes("jsx") ||
      testStr.includes("ts") ||
      testStr.includes("tsx")) &&
    rule.include &&
    rule.include.toString().includes(path.sep + "src" + path.sep)
  );
}

function addFileReplaceLoader(rule) {
  if (
    rule.loader &&
    rule.loader.includes("babel-loader") &&
    isSourceFileRule(rule)
  ) {
    const originalLoader = {
      loader: rule.loader,
      options: rule.options,
    };

    delete rule.loader;
    delete rule.options;

    rule.use = [
      originalLoader,
      {
        loader: "file-replace-loader",
        options: {
          condition: "always",
          async: true,
          replacement(resourcePath) {
            const mapping = {
              [path.resolve(
                "./node_modules/@react-three/fiber/dist/react-three-fiber.esm.js"
              )]: path.resolve("./react-three-fiber.esm.js"),
              [path.resolve(
                "./node_modules/@react-three/fiber/dist/react-three-fiber.cjs.prod.js"
              )]: path.resolve("./react-three-fiber.cjs.prod.js"),
            };
            return mapping[resourcePath];
          },
        },
      },
    ];
  }
}

function traverseRules(rules) {
  rules.forEach((rule) => {
    if (rule.oneOf) {
      traverseRules(rule.oneOf);
    } else if (rule.rules) {
      traverseRules(rule.rules);
    } else {
      if (
        rule.loader &&
        rule.loader.includes("babel-loader") &&
        rule.test &&
        (rule.test.toString().includes("js") ||
          rule.test.toString().includes("jsx") ||
          rule.test.toString().includes("ts") ||
          rule.test.toString().includes("tsx")) &&
        !rule.include
      ) {
        rule.include = path.resolve(__dirname, "src");
      }

      addFileReplaceLoader(rule);
    }
  });
}

module.exports = function override(config, env) {
  config.watchOptions = {
    ignored: /node_modules/,
  };

  traverseRules(config.module.rules);

  // ✅ Add ts-shader-loader inside `oneOf`
  const oneOfRule = config.module.rules.find((rule) => Array.isArray(rule.oneOf));

  if (oneOfRule) {
    oneOfRule.oneOf.unshift({
      test: /\.(glsl|vs|fs)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: "ts-shader-loader",
        },
      ],
    });
  } else {
    // Fallback: top-level injection
    config.module.rules.push({
      test: /\.(glsl|vs|fs)$/,
      exclude: /node_modules/,
      use: [
        {
          loader: "ts-shader-loader",
        },
      ],
    });
  }

  return config;
};