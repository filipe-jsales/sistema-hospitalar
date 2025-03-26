import { PartialType } from '@nestjs/swagger';
import { RoleDto } from './create-role.dto';
import { IsArray, IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateRoleDto extends PartialType(RoleDto) {
  @IsString()
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  users?: number[];

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  CreatePermissionDto?: number[];
}
