import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateUserDto } from './create-user.dto';
import { AuthUserDto } from './auth-user.dto';

export class CreateUserRequestDto {
  @ValidateNested()
  @Type(() => CreateUserDto)
  userInfos: CreateUserDto;

  @ValidateNested()
  @Type(() => AuthUserDto)
  user: AuthUserDto;
}
