module.exports = function override(config, env) {
  config.watchOptions = {
    ignored: /node_modules/,
  };
  return config;
};
