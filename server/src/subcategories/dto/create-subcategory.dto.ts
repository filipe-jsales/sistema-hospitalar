import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateSubcategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNumber()
  @IsNotEmpty({message: 'categoryId is required'})
  categoryId: number;
}
