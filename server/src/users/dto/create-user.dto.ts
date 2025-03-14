import { IsString, IsNotEmpty, MinLength, IsOptional, IsNumber, IsDate } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsOptional()
  @IsNumber()
  failedLoginAttempts?: number;

  @IsOptional()
  @IsDate()
  lastLogin?: Date;

  @IsOptional()
  isActive?: boolean;

}
