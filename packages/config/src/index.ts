import * as fs from 'fs-extra';
import * as yaml from 'js-yaml';
import * as path from 'path';

const FILE_ENV_NAME = {
  development: 'dev',
  test: 'test',
  production: 'prod',
};

const env = process.env.NODE_ENV || 'development';

export function getConfig() {
  const filePath = path.join(__dirname, '../../../config', `${FILE_ENV_NAME[env]}.yaml`);

  if (!fs.existsSync(filePath)) {
    throw new Error(`Can not find config file: ${filePath}`);
  }

  return yaml.load(fs.readFileSync(filePath, 'utf8')) as Record<string, unknown>;
}
