import * as fs from 'fs-extra';
import * as yaml from 'js-yaml';
import * as path from 'path';

const FILE_ENV_NAME = {
  development: 'dev',
  test: 'test',
  production: 'prod',
};

export function getConfig() {
  const env = process.env.NODE_ENV || 'development';

  const filePath = path.join(__dirname, '../../../config', `${FILE_ENV_NAME[env]}.yaml`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Can not find config file: ${filePath}`);
  }

  return yaml.load(fs.readFileSync(filePath, 'utf8')) as Record<string, unknown>;
}

export function getRuntimeConfig() {
  const env = process.env.NODE_ENV || 'development';

  let filePath = path.join(__dirname, '../../../../../../config', `${FILE_ENV_NAME[env]}.yaml`);

  if (!fs.existsSync(filePath)) {
    filePath = path.join(__dirname, '../../../config', `${FILE_ENV_NAME[env]}.yaml`);
  }

  if (!fs.existsSync(filePath)) {
    throw new Error(`Can not find config file: ${filePath}`);
  }

  return (yaml.load(fs.readFileSync(filePath, 'utf8')).dynamic || {}) as Record<string, unknown>;
}
