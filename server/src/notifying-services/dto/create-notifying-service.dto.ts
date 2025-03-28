import { IsNotEmpty, IsString } from 'class-validator';

export class CreateNotifyingServiceDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
