/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@uxaudit-pro/shared'],
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      ...config.resolve.alias,
      '@uxaudit-pro/shared': require.resolve('./packages/shared/src')
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      util: require.resolve('util/'),
    };
    return config;
  },
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

module.exports = nextConfig
