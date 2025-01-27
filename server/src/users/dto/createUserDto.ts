import { Type } from 'class-transformer';
import {
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsInt,
  ValidateNested,
} from 'class-validator';

export class UserForRequest {
  @IsOptional()
  id?: number;

  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  role: string;
}

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

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

export class CreateUserRequestDto {
  @ValidateNested()
  @Type(() => CreateUserDto)
  userInfos: CreateUserDto;

  @ValidateNested()
  @Type(() => UserForRequest)
  user: UserForRequest;
}
