import { IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateWikiDto {
  @IsNotEmpty({ message: '组织Id不能为空' })
  readonly organizationId: string;

  @IsString({ message: '知识库名称类型错误（正确类型为：String）' })
  @IsNotEmpty({ message: '知识库名称不能为空' })
  @MinLength(1, { message: '知识库名称至少1个字符' })
  @MaxLength(20, { message: '知识库名称最多20个字符' })
  readonly name: string;

  @IsString({ message: '知识库描述类型错误（正确类型为：String）' })
  description: string;

  @IsString({ message: '知识库头像类型错误（正确类型为：String）' })
  @IsOptional()
  readonly cover?: string;
}
