import { getOssClient, OssClient } from '@helpers/file.helper';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileService {
  private ossClient: OssClient;

  constructor(private readonly configService: ConfigService) {
    this.ossClient = getOssClient(this.configService);
  }

  async uploadFile(file, query) {
    return this.ossClient.uploadFile(file, query);
  }

  async initChunk(query) {
    return this.ossClient.initChunk(query);
  }

  async uploadChunk(file, query) {
    return this.ossClient.uploadChunk(file, query);
  }

  async mergeChunk(query) {
    return this.ossClient.mergeChunk(query);
  }
}
