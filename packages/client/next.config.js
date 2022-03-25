const semi = require('@douyinfe/semi-next').default({});
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const { getConfig } = require('@think/config');
const config = getConfig().client;

/** @type {import('next').NextConfig} */
const nextConfig = semi({
  assetPrefix: config.assetPrefix,
  env: {
    SERVER_API_URL: config.apiUrl,
    COLLABORATION_API_URL: config.collaborationUrl,
    ENABLE_ALIYUN_OSS: !!config?.oss?.aliyun?.accessKeyId,
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

module.exports = nextConfig;
