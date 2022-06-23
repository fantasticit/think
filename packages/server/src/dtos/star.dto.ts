import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class StarDto {
  @IsString({ message: '加星 wikiId 类型错误（正确类型为：String）' })
  @IsNotEmpty({ message: '加星 wikiId 不能为空' })
  wikiId: string;

  @IsString({ message: '加星 documentId 类型错误（正确类型为：String）' })
  @IsNotEmpty({ message: '加星 documentId 不能为空' })
  @IsOptional()
  documentId?: string;
}
