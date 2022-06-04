import { ConfigService } from '@nestjs/config';

export type FileQuery = {
  filename: string;
  md5: string;
  chunkIndex?: number;
};

export abstract class OssClient {
  abstract uploadFile(file: Express.Multer.File, query: FileQuery): Promise<string>;
  abstract initChunk(query: FileQuery): Promise<void | string>;
  abstract uploadChunk(file: Express.Multer.File, query: FileQuery): Promise<void>;
  abstract mergeChunk(query: FileQuery): Promise<string>;
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
}
