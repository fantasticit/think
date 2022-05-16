import { IsBoolean, IsString } from 'class-validator';

export class DocAuthDto {
  @IsString()
  readonly documentId: string;

  @IsString()
  readonly userName: string;

  @IsBoolean()
  readonly readable: boolean;

  @IsBoolean()
  readonly editable: boolean;
}
