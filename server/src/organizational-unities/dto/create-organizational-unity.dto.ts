import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateOrganizationalUnityDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  acronym: string;

  @IsNotEmpty()
  @IsNumber()
  managerId: number;

  // TODO: verify which fields are optional
  @IsString()
  organizationalAcronym: string;

  @IsString()
  organizationalUnitType: string;

  @IsString()
  managementGroup: string;

  @IsString()
  divisionalGrouping: string;

  @IsString()
  sectorGrouping: string;
}
