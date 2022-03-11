import { IsOptional } from 'class-validator';
import { WikiStatus } from '@think/domains';

export class ShareWikiDto {
  // 目标状态：公开或私有
  @IsOptional()
  nextStatus: WikiStatus;

  // 公开的文档
  @IsOptional()
  publicDocumentIds: Array<string>;

  // 私有的文档
  @IsOptional()
  privateDocumentIds: Array<string>;
}
