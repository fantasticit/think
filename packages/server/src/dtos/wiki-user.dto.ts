import { WikiUserRole } from '@think/domains';
import { IsString } from 'class-validator';

export class WikiUserDto {
  @IsString()
  readonly userName: string;

  @IsString()
  readonly userRole: WikiUserRole;
}
