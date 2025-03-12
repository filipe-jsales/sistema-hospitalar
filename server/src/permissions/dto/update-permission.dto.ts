import { PartialType } from '@nestjs/mapped-types';
import { CreatePermissionDto } from './create-permission.dto';
import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdatePermissionDto extends PartialType(CreatePermissionDto) {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  userDescription: string;

  @IsString()
  @IsOptional()
  action: string;

  @IsString()
  @IsOptional()
  subject: string;

  @IsArray()
  @IsOptional()
  @IsInt({ each: true })
  roles?: number[];
}
