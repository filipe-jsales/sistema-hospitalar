import { IsNotEmpty, IsString } from 'class-validator';

export class CreateThemeDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
