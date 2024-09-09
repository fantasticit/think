import {
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  GetObjectCommand,
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
  UploadPartCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import Redis from 'ioredis';

import { BaseOssClient, FileQuery } from './oss.client';

export class S3OssClient extends BaseOssClient {
  private client: S3Client | null;
  private bucket: string | null;
  private redis: Redis | null;

  async setRedis(redis: Redis) {
    this.redis = redis;
  }

  /**
   * 构建 s3 客户端
   * @returns
   */
  private ensureS3OssClient(): S3Client {
    if (this.client) {
      return this.client;
    }

    const config = this.configService.get('oss.s3.config');
    try {
      this.bucket = config.bucket;

      if (config.cloudisp == 'minio') {
        this.client = new S3Client({
          endpoint: config.endpoint,
          region: config.region,
          forcePathStyle: config.forcePathStyle,
          credentials: {
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.secretAccessKey,
          },
        });
      }

      if (config.cloudisp == 's3') {
        this.client = new S3Client({
          region: config.region,
          forcePathStyle: config.forcePathStyle,
          credentials: {
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.secretAccessKey,
          },
        });
      }

      if (config.cloudisp == 'aliyun') {
        this.client = new S3Client({
          region: config.region,
          endpoint: 'https://' + config.region + '.aliyuncs.com',
          // 阿里云不支持 虚拟路径,这里必须为false
          forcePathStyle: false,
          credentials: {
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.secretAccessKey,
          },
        });
      }

      if (config.cloudisp == 'tencent') {
        this.client = new S3Client({
          region: config.region,
          endpoint: 'https://cos.' + config.region + '.myqcloud.com',
          // 不支持 虚拟路径,这里必须为false
          forcePathStyle: false,
          credentials: {
            accessKeyId: config.accessKeyId,
            secretAccessKey: config.secretAccessKey,
          },
        });
      }

      return this.client;
    } catch (err) {
      console.log('无法启动S3存储服务，请检查S3配置是否正确', err.message);
    }
  }

  /**
   * 获取上传文件名
   * @param md5
   * @param filename
   * @returns
   */
  private getInOssFileName(md5, filename) {
    return `think/${md5}/${filename}`;
  }

  private async getObjectUrl(bucket, key) {
    this.ensureS3OssClient();
    const command = new GetObjectCommand({ Bucket: bucket, Key: key });
    const signUrl = await getSignedUrl(this.client, command);
    console.log('signUrl:' + signUrl);
    return signUrl.split('?')[0];
  }

  /**
   * 检查文件是否已存储到 oss
   * @param md5
   * @param filename
   * @returns
   */
  private async checkIfAlreadyInOss(md5, filename) {
    this.ensureS3OssClient();
    const inOssFileName = this.getInOssFileName(md5, filename);
    const command = new HeadObjectCommand({ Bucket: this.bucket, Key: inOssFileName });
    try {
      await this.client.send(command);
      return await this.getObjectUrl(this.bucket, inOssFileName);
    } catch (err) {
      return false;
    }
  }

  /**
   * 上传小文件
   * @param file
   * @param query
   * @returns
   */
  async uploadFile(file: Express.Multer.File, query: FileQuery): Promise<string> {
    this.ensureS3OssClient();
    const { filename, md5 } = query;
    const maybeOssURL = await this.checkIfAlreadyInOss(md5, filename);
    if (maybeOssURL) {
      return maybeOssURL;
    }

    const inOssFileName = this.getInOssFileName(md5, filename);
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: inOssFileName,
      Body: file.buffer,
    });
    await this.client.send(command);
    return await this.getObjectUrl(this.bucket, inOssFileName);
  }

  /**
   * 初始分片
   * @param file
   * @param query
   * @returns
   */
  async initChunk(query: FileQuery): Promise<string | void> {
    const { md5, filename } = query;
    this.ensureS3OssClient();

    const inOssFileName = this.getInOssFileName(md5, filename);
    const maybeOssURL = await this.checkIfAlreadyInOss(md5, filename);

    if (maybeOssURL) {
      return maybeOssURL as string;
    }
    const command = new CreateMultipartUploadCommand({ Bucket: this.bucket, Key: inOssFileName });
    const response = await this.client.send(command);
    const upload_id = response['UploadId'];
    // 这里使用redis 来存储 upload_id
    await this.redis.del('think:oss:chunk:' + md5);
    await this.redis.del('think:oss:chunk:' + md5 + '*');
    this.redis.set('think:oss:chunk:' + md5, upload_id);
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

    this.ensureS3OssClient();
    const inOssFileName = this.getInOssFileName(md5, filename);
    const upload_id = await this.redis.get('think:oss:chunk:' + md5);

    const command = new UploadPartCommand({
      Body: file.buffer,
      Bucket: this.bucket,
      Key: inOssFileName,
      PartNumber: chunkIndex,
      UploadId: upload_id,
    });
    const response = await this.client.send(command);
    this.redis.set(
      'think:oss:chunk:' + md5 + ':' + chunkIndex,
      JSON.stringify({ PartNumber: chunkIndex, ETag: response['ETag'] })
    );
  }

  /**
   * 合并分片
   * @param query
   * @returns
   */
  async mergeChunk(query: FileQuery): Promise<string> {
    const { filename, md5 } = query;
    const inOssFileName = this.getInOssFileName(md5, filename);
    const upload_id = await this.redis.get('think:oss:chunk:' + md5);
    const etags = await this.redis.keys('think:oss:chunk:' + md5 + ':*');
    const MultipartUpload = { Parts: [] };
    for (let i = 1; i <= etags.length; i++) {
      const obj = JSON.parse(await this.redis.get('think:oss:chunk:' + md5 + ':' + i));
      MultipartUpload.Parts.push(obj);
    }
    console.log(MultipartUpload, upload_id);
    const command = new CompleteMultipartUploadCommand({
      Bucket: this.bucket,
      Key: inOssFileName,
      UploadId: upload_id,
      MultipartUpload: MultipartUpload,
    });

    await this.client.send(command);
    await this.redis.del('think:oss:chunk:' + md5);
    await this.redis.del('think:oss:chunk:' + md5 + '*');
    return await this.getObjectUrl(this.bucket, inOssFileName);
  }
}
