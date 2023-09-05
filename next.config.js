/** @type {import('next').NextConfig} */
const TerserPlugin = require("terser-webpack-plugin");
const nextConfig = {
  webpack(config) {
    config.optimization.minimizer.push(
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
          },
        },
      })
    );
    return config;
  },
};

module.exports = nextConfig;
