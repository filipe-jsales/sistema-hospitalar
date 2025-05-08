import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ErrorCategory } from 'src/medication-errors/enums/error-category.enum';
import { ErrorDescription } from 'src/medication-errors/enums/error-description.enum';

export class CreateBloodComponentDto {
  @ApiProperty({
    description: 'The notification ID this blood component error belongs to',
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
