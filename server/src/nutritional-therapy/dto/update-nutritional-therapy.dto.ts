import { PartialType } from '@nestjs/swagger';
import { CreateNutritionalTherapyDto } from './create-nutritional-therapy.dto';

export class UpdateNutritionalTherapyDto extends PartialType(
  CreateNutritionalTherapyDto,
) {}
