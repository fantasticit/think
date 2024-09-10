const semi = require('@douyinfe/semi-next').default({});
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const { getConfig } = require('@think/config');
const config = getConfig();

const pwaRuntimeCaching = require('./pwa-cache');
const withPWA = require('next-pwa')({
  disable: process.env.NODE_ENV !== 'production',
  dest: 'public',
  sw: 'service-worker.js',
  runtimeCaching: pwaRuntimeCaching,
});

/** @type {import('next').NextConfig} */
const nextConfig = semi({
  experimental: {
    scrollRestoration: true,
    legacyBrowsers: false,
    browsersListForSwc: true,
  },
  assetPrefix: config.assetPrefix,
  env: {
    SERVER_API_URL: config.client.apiUrl,
    COLLABORATION_API_URL: config.client.collaborationUrl,
    ENABLE_OSS_S3: config.oss.s3.enable,
    DNS_PREFETCH: (config.client.dnsPrefetch || '').split(' '),
    SEO_APPNAME: config.client.seoAppName,
    SEO_DESCRIPTION: config.client.seoDescription,
    SEO_KEYWORDS: config.client.seoKeywords,
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
});

module.exports = withPWA(nextConfig);
