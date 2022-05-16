import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateDocumentDto {
  @IsString({ message: '文档名称类型错误（正确类型为：String）' })
  @IsNotEmpty({ message: '文档名称不能为空' })
  @MinLength(1, { message: '文档名称至少1个字符' })
  @MaxLength(50, { message: '文档名称最多50个字符' })
  readonly title: string;

  @IsOptional()
  content?: string;

  @IsOptional()
  state?: Uint8Array;
}
