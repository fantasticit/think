import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateOrganizationDto {
  @MinLength(1, { message: '组织名称至少1个字符' })
  @MaxLength(20, { message: '组织名称最多20个字符' })
  @IsString({ message: '组织名称类型错误（正确类型为：String）' })
  @IsNotEmpty({ message: '组织名称不能为空' })
  name: string;

  @IsString({ message: '组织描述类型错误（正确类型为：String）' })
  @IsOptional()
  description: string;

  @IsString({ message: '组织Logo类型错误（正确类型为：String）' })
  @IsOptional()
  logo: string;

  @IsBoolean()
  @IsOptional()
  isPersonal?: boolean;
}
