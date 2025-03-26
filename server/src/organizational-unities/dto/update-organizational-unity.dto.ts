import { PartialType } from '@nestjs/swagger';
import { CreateOrganizationalUnityDto } from './create-organizational-unity.dto';

export class UpdateOrganizationalUnityDto extends PartialType(CreateOrganizationalUnityDto) {}
