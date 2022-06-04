import { FILE_CHUNK_SIZE } from '@think/domains';
import * as AliyunOSS from 'ali-oss';
import * as fs from 'fs-extra';
import * as os from 'os';
import * as path from 'path';

import { pipeWriteStream } from './local.client';
import { BaseOssClient, FileQuery } from './oss.client';

export class AliyunOssClient extends BaseOssClient {
  private client: AliyunOSS | null;

  /**
   * 构建 ali-oss 客户端
   * @returns
   */
  private ensureAliyunOssClient(): AliyunOSS {
    if (this.client) {
      return this.client;
    }

    const config = this.configService.get('oss.aliyun.config');

    try {
      this.client = new AliyunOSS(config);
      return this.client;
    } catch (err) {
      console.log('无法启动阿里云存储服务，请检查阿里云 OSS 配置是否正确', err.message);
    }
  }

  /**
   * 获取上传文件名
   * @param md5
   * @param filename
   * @returns
   */
  private getInOssFileName(md5, filename) {
    return `/think/${md5}/${filename}`;
  }

  /**
   * 检查文件是否已存储到 oss
   * @param md5
   * @param filename
   * @returns
   */
  private async checkIfAlreadyInOss(md5, filename) {
    this.ensureAliyunOssClient();
    const inOssFileName = this.getInOssFileName(md5, filename);
    const ifExist = await this.client.head(inOssFileName).catch(() => false);

    if (ifExist) {
      return ifExist.res.requestUrls[0];
    }

    return false;
  }

  /**
   * 获取文件临时存储路径
   * @param md5
   * @returns
   */
  private getStoreDir(md5: string) {
    const tmpdir = os.tmpdir();
    const dir = path.join(tmpdir, md5);
    fs.ensureDirSync(dir);
    return dir;
  }

  /**
   * 上传小文件
   * @param file
   * @param query
   * @returns
   */
  async uploadFile(file: Express.Multer.File, query: FileQuery): Promise<string> {
    const client = this.ensureAliyunOssClient();
    const { filename, md5 } = query;

    const maybeOssURL = await this.checkIfAlreadyInOss(md5, filename);
    if (maybeOssURL) {
      return maybeOssURL;
    }

    const inOssFileName = this.getInOssFileName(md5, filename);
    const res = await client.put(inOssFileName, file.buffer);
    return res.url;
  }

  /**
   * 将切片临时存储到服务器
   * FIXME: 阿里云的文档没看懂，故做成这种服务器中转的蠢模式
   * @param file
   * @param query
   * @returns
   */
  async initChunk(query: FileQuery): Promise<string | void> {
    const { md5, filename } = query;

    const maybeOssURL = await this.checkIfAlreadyInOss(md5, filename);
    if (maybeOssURL) {
      return maybeOssURL;
    }

    return '';
  }

  /**
   * 将切片临时存储到服务器
   * FIXME: 阿里云的文档没看懂，故做成这种服务器中转的蠢模式
   * @param file
   * @param query
   * @returns
   */
  async uploadChunk(file: Express.Multer.File, query: FileQuery): Promise<void> {
    const { md5, chunkIndex } = query;

    if (!('chunkIndex' in query)) {
      throw new Error('请指定 chunkIndex');
    }

    const dir = this.getStoreDir(md5);
    const chunksDir = path.join(dir, 'chunks');
    fs.ensureDirSync(chunksDir);
    fs.writeFileSync(path.join(chunksDir, '' + chunkIndex), file.buffer);
  }

  /**
   * 合并切片后上传到阿里云
   * FIXME: 阿里云的文档没看懂，故做成这种服务器中转的蠢模式
   * @param query
   * @returns
   */
  async mergeChunk(query: FileQuery): Promise<string> {
    const { filename, md5 } = query;

    this.ensureAliyunOssClient();
    const inOssFileName = this.getInOssFileName(md5, filename);

    const dir = this.getStoreDir(md5);
    const absoluteFilepath = path.join(dir, filename);
    const chunksDir = path.join(dir, 'chunks');
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
    const ret = await this.client.multipartUpload(inOssFileName, absoluteFilepath);
    fs.removeSync(absoluteFilepath);
    return ret.res.requestUrls[0];
  }
}
