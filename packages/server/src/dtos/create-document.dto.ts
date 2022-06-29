import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateDocumentDto {
  @IsNotEmpty({ message: '组织Id不能为空' })
  readonly organizationId: string;

  @IsNotEmpty({ message: '知识库Id不能为空' })
  readonly wikiId: string;

  @IsOptional()
  readonly parentDocumentId?: string;

  @IsString({ message: '文档名称类型错误（正确类型为：String）' })
  @IsNotEmpty({ message: '文档名称不能为空' })
  @MinLength(1, { message: '文档名称至少1个字符' })
  @IsOptional()
  readonly title?: string;

  @IsOptional()
  readonly templateId?: string;

  @IsOptional()
  readonly content?: string;

  @IsOptional()
  state?: Buffer;
}
