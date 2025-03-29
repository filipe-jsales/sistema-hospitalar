import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateIncidentDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  treatmentStartDate: number;

  @IsNotEmpty()
  @IsNumber()
  conclusionDate: number;
}
