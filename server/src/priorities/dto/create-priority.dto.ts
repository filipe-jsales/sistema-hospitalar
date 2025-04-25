import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePriorityDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  numericalPriority: number;
}
