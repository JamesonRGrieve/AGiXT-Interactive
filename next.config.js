module.exports = {
  webpack(config, options) {
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      loader: "ts-loader",
      options: {
        transpileOnly: true,
      },
    });
    return config;
  },
};
