import { FILE_CHUNK_SIZE } from '@think/domains';
import * as fs from 'fs-extra';
import * as path from 'path';

import { BaseOssClient, FileQuery } from './oss.client';

export const FILE_DEST = '/' + 'static';
export const FILE_ROOT_PATH = path.join(__dirname, '../../../', FILE_DEST);

export const pipeWriteStream = (filepath, writeStream): Promise<void> => {
  return new Promise((resolve) => {
    const readStream = fs.createReadStream(filepath);
    readStream.on('end', () => {
      fs.unlinkSync(filepath);
      resolve();
    });
    readStream.pipe(writeStream);
  });
};

export class LocalOssClient extends BaseOssClient {
  /**
   * 文件存储路径
   * @param md5
   * @returns
   */
  protected getStoreDir(md5: string): {
    relative: string;
    absolute: string;
  } {
    const filepath = path.join(FILE_ROOT_PATH, md5);
    fs.ensureDirSync(filepath);
    return { relative: filepath.replace(FILE_ROOT_PATH, FILE_DEST), absolute: filepath };
  }

  /**
   * 将文件存储的相对路径拼接为可访问 URL
   * @param serverRoot
   * @param relativeFilePath
   * @returns
   */
  protected serveFilePath(relativeFilePath: string) {
    const serverRoot = this.configService.get('oss.local.server');

    if (!serverRoot) {
      throw new Error(`本地文件存储已启动，但未配置 oss.local.server，请在 config 完善！`);
    }

    return new URL(relativeFilePath, serverRoot).href;
  }

  /**
   * 小文件上传
   * @param file
   * @param query
   * @returns
   */
  async uploadFile(file: Express.Multer.File, query: FileQuery): Promise<string> {
    const { filename, md5 } = query;
    const { absolute, relative } = this.getStoreDir(md5);
    const absoluteFilepath = path.join(absolute, filename);
    const relativeFilePath = path.join(relative, filename);

    if (!fs.existsSync(absoluteFilepath)) {
      fs.writeFileSync(absoluteFilepath, file.buffer);
    }

    return this.serveFilePath(relativeFilePath);
  }

  /**
   * 文件分块初始化
   * @param file
   * @param query
   */
  async initChunk(query: FileQuery): Promise<void | string> {
    const { filename, md5 } = query;

    const { absolute, relative } = this.getStoreDir(md5);
    const absoluteFilepath = path.join(absolute, filename);

    if (fs.existsSync(absoluteFilepath)) {
      const relativeFilePath = path.join(relative, filename);
      return this.serveFilePath(relativeFilePath);
    }

    return '';
  }

  /**
   * 文件分块上传
   * @param file
   * @param query
   */
  async uploadChunk(file: Express.Multer.File, query: FileQuery): Promise<void> {
    const { md5, chunkIndex } = query;

    if (!('chunkIndex' in query)) {
      throw new Error('请指定 chunkIndex');
    }

    const { absolute } = this.getStoreDir(md5);
    const chunksDir = path.join(absolute, 'chunks');
    fs.ensureDirSync(chunksDir);
    fs.writeFileSync(path.join(chunksDir, '' + chunkIndex), file.buffer);
  }

  /**
   * 合并分块
   * @param query
   * @returns
   */
  async mergeChunk(query: FileQuery): Promise<string> {
    const { filename, md5 } = query;
    const { absolute, relative } = this.getStoreDir(md5);
    const absoluteFilepath = path.join(absolute, filename);
    const relativeFilePath = path.join(relative, filename);

    if (!fs.existsSync(absoluteFilepath)) {
      const chunksDir = path.join(absolute, 'chunks');
      const chunks = fs.readdirSync(chunksDir);
      chunks.sort((a, b) => Number(a) - Number(b));

      await Promise.all(
        chunks.map((chunk, index) => {
          return pipeWriteStream(
            path.join(chunksDir, chunk),
            fs.createWriteStream(absoluteFilepath, {
              start: index * FILE_CHUNK_SIZE,
              end: (index + 1) * FILE_CHUNK_SIZE,
            })
          );
        })
      );

      fs.removeSync(chunksDir);
    }

    return this.serveFilePath(relativeFilePath);
  }
}
