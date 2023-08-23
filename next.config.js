/** @type {import('next').NextConfig} */

module.exports = {
  webpack: (config) => {
    config.resolve.fallback = {
      fs: false,
    };

    config.module.rules.push({
      test: /\.tsx?$/,
      use: "ts-loader",
      exclude: /node_modules/,
    });

    return config;
  },
};
