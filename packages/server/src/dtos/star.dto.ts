import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class StarDto {
  @IsNotEmpty({ message: '组织Id不能为空' })
  readonly organizationId: string;

  @IsString({ message: '加星 wikiId 类型错误（正确类型为：String）' })
  @IsNotEmpty({ message: '加星 wikiId 不能为空' })
  wikiId: string;

  @IsOptional()
  documentId?: string;
}
