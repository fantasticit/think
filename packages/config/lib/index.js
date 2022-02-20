"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConfig = void 0;
const fs = require("fs-extra");
const yaml = require("js-yaml");
const path = require("path");
const FILE_ENV_NAME = {
    development: 'dev',
    test: 'test',
    production: 'prod',
};
const env = process.env.NODE_ENV || 'development';
function getConfig() {
    const filePath = path.join(__dirname, '../yaml/', `${FILE_ENV_NAME[env]}.yaml`);
    if (!fs.existsSync(filePath)) {
        throw new Error(`Can not find config file: ${filePath}`);
    }
    return yaml.load(fs.readFileSync(filePath, 'utf8'));
}
exports.getConfig = getConfig;
//# sourceMappingURL=index.js.map