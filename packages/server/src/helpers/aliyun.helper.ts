import * as AliyunOSS from 'ali-oss';
import { ConfigService } from '@nestjs/config';

export class AliyunOssClient {
  configService: ConfigService;

  constructor(config) {
    this.configService = config;
  }

  private async buildClient() {
    const config = this.configService.get('oss.aliyun');
    return new AliyunOSS(config);
  }

  async putFile(filepath: string, buffer: ReadableStream) {
    const client = await this.buildClient();
    const { url } = await client.put(filepath, buffer);
    return url;
  }

  async deleteFile(url: string) {
    const client = await this.buildClient();
    await client.delete(url);
  }
}
