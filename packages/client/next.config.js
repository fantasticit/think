const semi = require('@douyinfe/semi-next').default({});
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const withOffline = require('next-offline');
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
  workboxOpts: {
    runtimeCaching: [
      {
        urlPattern: /.(png|jpg|jpeg|svg|webp)$/,
        handler: 'CacheFirst',
      },
      {
        urlPattern: /api/,
        handler: 'NetworkFirst',
        options: {
          cacheableResponse: {
            statuses: [0, 200],
            headers: {
              'x-sw': 'true',
            },
          },
        },
      },
    ],
  },
});

module.exports = withOffline(nextConfig);
