// next.config.js

/** @type {import('next').NextConfig} */

const path = require("path");

module.exports = {
  webpack(config) {
    config.module.rules.push({
      test: /\.tsx?$/,
      use: "ts-loader",
      exclude: /node_modules/,
    });

    return config;
  },

  // Configure Babel
  babel: {
    presets: ["next/babel"],
    plugins: [
      [
        "@babel/plugin-transform-typescript",
        {
          isTSX: true,
        },
      ],
    ],
  },

  // Alias agixt to dist
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      agixt$: path.resolve(__dirname, "node_modules/agixt/dist/index.js"),
    };

    return config;
  },
};
