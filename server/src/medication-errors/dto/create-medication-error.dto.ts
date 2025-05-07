import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ErrorDescription } from '../enums/error-description.enum';
import { ErrorCategory } from '../enums/error-category.enum';

export class CreateMedicationErrorDto {
  @ApiProperty({
    description: 'The notification ID this medication error belongs to',
  })
  @IsNumber()
  @IsNotEmpty()
  notificationId: number;

  @IsOptional()
  @IsInt()
  notifyingServiceId?: number;

  @ApiProperty({
    description: 'Error category',
    enum: ErrorCategory,
    enumName: 'ErrorCategory',
  })
  @IsEnum(ErrorCategory)
  @IsNotEmpty()
  errorCategory: ErrorCategory;

  @ApiProperty({
    description: 'Error description',
    enum: ErrorDescription,
    enumName: 'ErrorDescription',
  })
  @IsEnum(ErrorDescription)
  errorDescription: ErrorDescription;

  @ApiProperty({ description: 'Additional description text', required: false })
  @IsString()
  @IsOptional()
  description?: string;
}
