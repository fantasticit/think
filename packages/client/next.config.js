const semi = require('@douyinfe/semi-next').default({});
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const withPWA = require('next-pwa');
const { getConfig } = require('@think/config');
const config = getConfig();

/** @type {import('next').NextConfig} */
const nextConfig = semi({
  assetPrefix: config.assetPrefix,
  env: {
    SERVER_API_URL: config.client.apiUrl,
    COLLABORATION_API_URL: config.client.collaborationUrl,
    ENABLE_ALIYUN_OSS: !!config.oss.aliyun.accessKeyId,
    DRAWIO_URL: config.client.drawioUrl || 'https://embed.diagrams.net',
  },
  webpack: (config, { dev, isServer }) => {
    config.resolve.plugins.push(new TsconfigPathsPlugin());
    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // FIXME: douyinfe 的第三方包存在 ts 类型错误！
  typescript: {
    ignoreBuildErrors: true,
  },
  compiler: {
    removeConsole: true,
  },
  pwa: {
    disable: process.env.NODE_ENV !== 'production',
    dest: '.next',
    sw: 'service-worker.js',
  },
});

module.exports = withPWA(nextConfig);
