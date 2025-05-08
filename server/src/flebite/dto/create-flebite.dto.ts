import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { FlebiteClassification, FlebiteRiskLevel } from '../enums/flebite.enum';

export class CreateFlebiteDto {
  @ApiProperty({
    description: 'The notification ID this flebite error belongs to',
  })
  @IsNumber()
  @IsNotEmpty()
  notificationId: number;

  @IsOptional()
  @IsInt()
  notifyingServiceId?: number;

  @ApiProperty({
    description: 'Flebite Classification',
    enum: FlebiteClassification,
    enumName: 'FlebiteClassification',
  })
  @IsEnum(FlebiteClassification)
  @IsNotEmpty()
  classification: FlebiteClassification;

  @ApiProperty({
    description: 'Flebite Risk Level',
    enum: FlebiteRiskLevel,
    enumName: 'FlebiteRiskLevel',
  })
  @IsEnum(FlebiteRiskLevel)
  riskLevel: FlebiteRiskLevel;

  @ApiProperty({ description: 'Additional description text', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
