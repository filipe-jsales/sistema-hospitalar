import { PartialType } from '@nestjs/swagger';
import { CreateBloodComponentDto } from './create-blood-component.dto';

export class UpdateBloodComponentDto extends PartialType(
  CreateBloodComponentDto,
) {}
