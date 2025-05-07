import { PartialType } from '@nestjs/swagger';
import { CreateFlebiteDto } from './create-flebite.dto';

export class UpdateFlebiteDto extends PartialType(CreateFlebiteDto) {}
