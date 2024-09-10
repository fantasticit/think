import { ConfigService } from '@nestjs/config';

import exp from 'constants';
import Redis from 'ioredis';

export type FileQuery = {
  filename: string;
  md5: string;
  chunkIndex?: number;
  fileSize?: number;
  uploadId?: string;
};

export type FileMerge = {
  filename: string;
  md5: string;
  uploadId: string;
  MultipartUpload: any;
};

export type chunkUpload = {
  uploadId: string;
  chunkIndex: number;
  etag: string;
};

export type ossSignReponse = {
  MultipartUpload: boolean;
  isExist: boolean;
  uploadId: string | null;
  objectKey: string;
  objectUrl: string | null;
  signUrl: string | null;
};

export type ossChunkResponse = {
  signUrl: string;
  uploadId: string;
  chunkIndex: number;
};

export abstract class OssClient {
  [x: string]: any;
  abstract uploadFile(file: Express.Multer.File, query: FileQuery): Promise<string>;
  abstract initChunk(query: FileQuery): Promise<void | string>;
  abstract uploadChunk(file: Express.Multer.File, query: FileQuery): Promise<void>;
  abstract mergeChunk(query: FileQuery): Promise<string>;
  abstract ossSign(query: FileQuery): Promise<ossSignReponse>;
  abstract ossChunk(query: FileQuery): Promise<ossChunkResponse>;
  abstract ossMerge(query: FileMerge): Promise<string>;
}

export class BaseOssClient implements OssClient {
  protected configService: ConfigService;

  constructor(configService) {
    this.configService = configService;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  uploadFile(file: Express.Multer.File, query: FileQuery): Promise<string> {
    throw new Error('Method not implemented.');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  initChunk(query: FileQuery): Promise<void | string> {
    throw new Error('Method not implemented.');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  uploadChunk(file: Express.Multer.File, query: FileQuery): Promise<void> {
    throw new Error('Method not implemented.');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  mergeChunk(query: FileQuery): Promise<string> {
    throw new Error('Method not implemented.');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ossSign(query: FileQuery): Promise<ossSignReponse> {
    throw new Error('Method not implemented.');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ossMerge(query: FileMerge): Promise<string> {
    throw new Error('Method not implemented.');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ossChunk(query: FileQuery): Promise<ossChunkResponse> {
    throw new Error('Method not implemented.');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setRedis(redis: Redis): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
