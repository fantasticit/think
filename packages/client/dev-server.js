const { getConfig } = require('@think/config');
const config = getConfig();
const cli = require('next/dist/cli/next-dev');

const port = (config.client && config.client.port) || 5001;

try {
  cli.nextDev(['-p', port]);
  console.log(`[think] 客户端已启动，端口：${port}`);
} catch (err) {
  console.log(`[think] 客户端启动失败！${err.message || err}`);
}
