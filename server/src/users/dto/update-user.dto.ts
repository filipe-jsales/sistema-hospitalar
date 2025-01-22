import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsInt,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  password?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  role?: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsInt()
  @IsOptional()
  failedLoginAttempts?: number;
}
