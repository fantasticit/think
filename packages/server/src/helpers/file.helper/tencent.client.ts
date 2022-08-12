import * as TencentCos from 'cos-nodejs-sdk-v5';
import * as fs from 'fs-extra';
import * as os from 'os';
import * as path from 'path';

import { BaseOssClient, FileQuery } from './oss.client';

/**
 * 生产环境会以集群方式运行，通过文件来确保 uploadId 只被初始化一次
 * @param inOssFileName
 * @param uploadId
 * @returns
 */
function initUploadId(inOssFileName, uploadId) {
  const uploadIdFile = path.join(os.tmpdir(), inOssFileName);
  fs.ensureFileSync(uploadIdFile);
  return fs.writeFileSync(uploadIdFile, uploadId);
}

function getUploadId(inOssFileName) {
  const uploadIdFile = path.join(os.tmpdir(), inOssFileName);
  return fs.readFileSync(uploadIdFile, 'utf-8');
}

function deleteUploadId(inOssFileName) {
  const uploadIdFile = path.join(os.tmpdir(), inOssFileName);
  return fs.removeSync(uploadIdFile);
}

export class TencentOssClient extends BaseOssClient {
  private client: TencentCos | null;

  /**
   * 构建客户端
   * @returns
   */
  private ensureOssClient(): TencentCos {
    if (this.client) {
      return this.client;
    }

    const config = this.configService.get('oss.tencent.config');

    try {
      this.client = new TencentCos(config);
      return this.client;
    } catch (err) {
      console.log('无法启动腾讯云存储服务，请检查腾讯云 COS 配置是否正确', err.message);
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
  private async checkIfAlreadyInOss(inOssFileName): Promise<boolean | string> {
    const params = {
      Bucket: this.configService.get('oss.tencent.config.Bucket'),
      Region: this.configService.get('oss.tencent.config.Region'),
      Key: inOssFileName,
    };

    return new Promise((resolve, reject) => {
      this.ensureOssClient();
      this.client.headObject(params, (err) => {
        if (err) {
          resolve(false);
        } else {
          this.client.getObjectUrl({ ...params, Sign: false }, (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve(data.Url);
            }
          });
        }
      });
    });
  }

  /**
   * 上传小文件到 oss
   * @param inOssFileName
   * @param file
   * @returns
   */
  private putObject(inOssFileName, file): Promise<string> {
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: this.configService.get('oss.tencent.config.Bucket'),
        Region: this.configService.get('oss.tencent.config.Region'),
        Key: inOssFileName,
      };
      this.ensureOssClient();
      this.client.putObject(
        {
          ...params,
          StorageClass: 'STANDARD',
          Body: file.buffer, // 上传文件对象
        },
        (err) => {
          if (err) {
            reject(err);
          }
          this.client.getObjectUrl({ ...params, Sign: false }, (err, data) => {
            if (err) {
              reject(err);
            } else {
              resolve(data.Url);
            }
          });
        }
      );
    });
  }

  /**
   * 上传分片
   * @param uploadId
   * @param inOssFileName
   * @param chunkIndex
   * @param file
   * @returns
   */
  private uploadChunkToCos(uploadId, inOssFileName, chunkIndex, file): Promise<void> {
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: this.configService.get('oss.tencent.config.Bucket'),
        Region: this.configService.get('oss.tencent.config.Region'),
        Key: inOssFileName,
        UploadId: uploadId,
        PartNumber: chunkIndex,
        Body: file.buffer,
      };
      this.ensureOssClient();
      this.client.multipartUpload(params, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * 完成上传分片
   * @param uploadId
   * @param inOssFileName
   * @param chunkIndex
   * @param file
   * @returns
   */
  private completeUploadChunkToCos(uploadId, inOssFileName): Promise<string> {
    return new Promise((resolve, reject) => {
      const params = {
        Bucket: this.configService.get('oss.tencent.config.Bucket'),
        Region: this.configService.get('oss.tencent.config.Region'),
        Key: inOssFileName,
      };
      this.ensureOssClient();

      this.client.multipartListPart(
        {
          ...params,
          UploadId: uploadId,
        },
        (err, data) => {
          if (err) {
            reject(err);
          } else {
            const parts = data.Part;

            this.client.multipartComplete(
              {
                ...params,
                UploadId: uploadId,
                Parts: parts,
              },
              (err) => {
                if (err) {
                  reject(err);
                } else {
                  this.client.getObjectUrl({ ...params, Sign: false }, (err, data) => {
                    if (err) {
                      reject(err);
                    } else {
                      resolve(data.Url);
                    }
                  });
                }
              }
            );
          }
        }
      );
    });
  }

  /**
   * 上传小文件
   * @param file
   * @param query
   * @returns
   */
  async uploadFile(file: Express.Multer.File, query: FileQuery): Promise<string> {
    this.ensureOssClient();
    const { filename, md5 } = query;
    const inOssFileName = this.getInOssFileName(md5, filename);

    const maybeOssURL = await this.checkIfAlreadyInOss(inOssFileName);
    if (maybeOssURL) {
      return maybeOssURL as string;
    }

    const res = await this.putObject(inOssFileName, file);
    return res as string;
  }

  /**
   * 初始分片
   * @param file
   * @param query
   * @returns
   */
  async initChunk(query: FileQuery): Promise<string | void> {
    const { md5, filename } = query;
    this.ensureOssClient();

    const inOssFileName = this.getInOssFileName(md5, filename);
    const maybeOssURL = await this.checkIfAlreadyInOss(inOssFileName);

    if (maybeOssURL) {
      return maybeOssURL as string;
    }

    const params = {
      Bucket: this.configService.get('oss.tencent.config.Bucket'),
      Region: this.configService.get('oss.tencent.config.Region'),
      Key: inOssFileName,
    };

    const promise = new Promise((resolve, reject) => {
      this.client.multipartInit(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          const uploadId = data.UploadId;
          initUploadId(inOssFileName, uploadId);
          resolve(uploadId);
        }
      });
    });

    await promise;
    return '';
  }

  /**
   * 上传分片
   * @param file
   * @param query
   * @returns
   */
  async uploadChunk(file: Express.Multer.File, query: FileQuery): Promise<void> {
    const { md5, filename, chunkIndex } = query;

    if (!('chunkIndex' in query)) {
      throw new Error('请指定 chunkIndex');
    }

    this.ensureOssClient();
    const inOssFileName = this.getInOssFileName(md5, filename);
    const uploadId = getUploadId(inOssFileName);
    await this.uploadChunkToCos(uploadId, inOssFileName, chunkIndex, file);
  }

  /**
   * 合并分片
   * @param query
   * @returns
   */
  async mergeChunk(query: FileQuery): Promise<string> {
    const { filename, md5 } = query;
    const inOssFileName = this.getInOssFileName(md5, filename);
    const uploadId = getUploadId(inOssFileName);
    const data = await this.completeUploadChunkToCos(uploadId, inOssFileName);
    deleteUploadId(inOssFileName);
    return data;
  }
}
