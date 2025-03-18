import { IsString } from 'class-validator';

export class CreateHospitalDto {
  @IsString()
  name: string;
}
