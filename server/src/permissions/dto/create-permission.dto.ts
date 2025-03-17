import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreatePermissionDto {
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
  @ArrayNotEmpty()
  @IsInt({ each: true })
  roles?: number[];
}
