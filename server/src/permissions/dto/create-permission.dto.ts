import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePermissionDto {
  @IsInt()
  id: number;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  userDescription: string;

  @IsString()
  action: string;

  @IsString()
  subject: string;

  @IsArray()
  @IsOptional()
  @IsInt({ each: true })
  @ArrayNotEmpty()
  roles?: number[];
}
