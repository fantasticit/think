import { AliyunOssClient } from '@helpers/aliyun.helper';
import { dateFormat } from '@helpers/date.helper';
import { uniqueid } from '@helpers/uniqueid.helper';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileService {
  private ossClient: AliyunOssClient;

  constructor(private readonly configService: ConfigService) {
    this.ossClient = new AliyunOssClient(this.configService);
  }

  /**
   * 上传文件
   * @param file
   */
  async uploadFile(file) {
    const { originalname, buffer } = file;
    const filename = `/${dateFormat(new Date(), 'yyyy-MM-dd')}/${uniqueid()}/${originalname}`;
    const url = await this.ossClient.putFile(filename, buffer);
    return url;
  }
}
