import { PartialType } from '@nestjs/swagger';
import { CreateNotifyingServiceDto } from './create-notifying-service.dto';

export class UpdateNotifyingServiceDto extends PartialType(CreateNotifyingServiceDto) {}
