import { IsNotEmpty, IsString } from 'class-validator';

export class CreateResponsibleDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  cpf: string;

  @IsNotEmpty()
  @IsString()
  email: string;
}
