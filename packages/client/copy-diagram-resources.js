/**
 * 将流程图编辑器所需的资源拷贝到 .next 目录中，配合 nginx 运行
 */
const fs = require('fs-extra');

fs.copySync('./public', './.next');
