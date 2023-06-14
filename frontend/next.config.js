const withPlugins = require('next-compose-plugins');
const withTM = require('next-transpile-modules')(['hashconnect']);

const nextConfig = {
  images: {
    domains: ['wallet.hashpack.app'],
  },
  // Other Next.js configuration options
  webpack: (config) => {
    config.module.rules.push({
      test: /\.css$/,
      use: ['style-loader', 'css-loader', 'postcss-loader'],
    });

    return config;
  },
};

module.exports = withPlugins([withTM], nextConfig);
