import { PartialType } from '@nestjs/swagger';
import { CreateMedicationErrorDto } from './create-medication-error.dto';

export class UpdateMedicationErrorDto extends PartialType(
  CreateMedicationErrorDto,
) {}
