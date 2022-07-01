import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class TemplateDto {
  @IsString({ message: '名称类型错误（正确类型为：String）' })
  @IsNotEmpty({ message: '名称不能为空' })
  @MinLength(1, { message: '名称至少1个字符' })
  @MaxLength(100, { message: '名称最多100个字符' })
  readonly title: string;

  @IsOptional()
  content?: string;

  @IsOptional()
  state?: Uint8Array;

  @IsOptional()
  isPublic?: boolean;
}
