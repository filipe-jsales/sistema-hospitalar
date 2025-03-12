import {
  IsNumber,
  IsEmail,
  IsOptional,
  IsArray,
  ValidateNested,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RoleDto } from '../../roles/dto/create-role.dto';

export class AuthUserDto {
  @IsNumber()
  @IsOptional()
  id: number;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  password: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoleDto)
  roles?: RoleDto[];
}
