import { IsString } from 'class-validator';
import { WikiUserRole } from '@think/domains';

export class WikiUserDto {
  @IsString()
  readonly userName: string;

  @IsString()
  readonly userRole: WikiUserRole;
}
