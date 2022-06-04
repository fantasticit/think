import * as TencentCos from 'cos-nodejs-sdk-v5';

import { BaseOssClient, FileQuery } from './oss.client';

export class TencentOssClient extends BaseOssClient {
  private client: TencentCos | null;
  private uploadIdMap: Map<string, string> = new Map();
  private uploadChunkEtagMap: Map<
    string,
    {
      PartNumber: number;
      ETag: string;
    }[]
  > = new Map();

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
          this.client.getObjectUrl(params, (err, data) => {
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
          this.client.getObjectUrl(params, (err, data) => {
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
   * 初始化分块上传
   * @param inOssFileName
   * @returns
   */
  private getUploadChunkId(inOssFileName): Promise<string> {
    if (this.uploadIdMap.has(inOssFileName)) {
      return Promise.resolve(this.uploadIdMap.get(inOssFileName));
    }

    return new Promise((resolve, reject) => {
      const params = {
        Bucket: this.configService.get('oss.tencent.config.Bucket'),
        Region: this.configService.get('oss.tencent.config.Region'),
        Key: inOssFileName,
      };
      this.ensureOssClient();
      this.client.multipartInit(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          const uploadId = data.UploadId;
          this.uploadIdMap.set(inOssFileName, uploadId);
          resolve(uploadId);
        }
      });
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
      this.client.multipartUpload(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          if (!this.uploadChunkEtagMap.has(uploadId)) {
            this.uploadChunkEtagMap.set(uploadId, []);
          }
          this.uploadChunkEtagMap.get(uploadId).push({
            PartNumber: chunkIndex,
            ETag: data.ETag,
          });
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
      const parts = this.uploadChunkEtagMap.get(uploadId);
      parts.sort((a, b) => a.PartNumber - b.PartNumber);

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
            this.client.getObjectUrl(params, (err, data) => {
              if (err) {
                reject(err);
              } else {
                resolve(data.Url);
              }
            });
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
   * 上传分片
   * @param file
   * @param query
   * @returns
   */
  async uploadChunk(file: Express.Multer.File, query: FileQuery): Promise<string | void> {
    const { md5, filename, chunkIndex } = query;

    if (!('chunkIndex' in query)) {
      throw new Error('请指定 chunkIndex');
    }

    this.ensureOssClient();
    const inOssFileName = this.getInOssFileName(md5, filename);

    const maybeOssURL = await this.checkIfAlreadyInOss(inOssFileName);
    if (maybeOssURL) {
      return maybeOssURL as string;
    }

    const uploadId = await this.getUploadChunkId(inOssFileName);
    await this.uploadChunkToCos(uploadId, inOssFileName, chunkIndex, file);
    return '';
  }

  /**
   * 合并分片
   * @param query
   * @returns
   */
  async mergeChunk(query: FileQuery): Promise<string> {
    const { filename, md5 } = query;
    const inOssFileName = this.getInOssFileName(md5, filename);
    const uploadId = await this.getUploadChunkId(inOssFileName);
    const data = await this.completeUploadChunkToCos(uploadId, inOssFileName);
    this.uploadIdMap.delete(inOssFileName);
    this.uploadChunkEtagMap.delete(uploadId);
    return data;
  }
}
