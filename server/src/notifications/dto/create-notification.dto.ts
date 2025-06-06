import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { DeadlineStatus } from '../enums/deadline.enum';

export class CreateNotificationDto {
  @IsNotEmpty()
  @IsNumber()
  priorityId: number;

  @IsNotEmpty()
  @IsNumber()
  incidentId: number;

  @IsNotEmpty()
  @IsNumber()
  responsibleId: number;

  @IsNotEmpty()
  @IsOptional()
  @IsNumber()
  notificationNumber: number;

  @IsNotEmpty()
  @IsNumber()
  organizationalUnityId: number;

  @IsNotEmpty()
  @IsNumber()
  notifyingServiceId: number;

  @IsOptional()
  @IsNumber()
  incidentLocation: number;

  @IsNotEmpty()
  @IsDateString()
  initialDate: Date;

  @IsNotEmpty()
  @IsDateString()
  endDate: Date;

  @IsString()
  situation: string;

  @IsString()
  anvisaNotification: string;

  @IsNotEmpty()
  @IsNumber()
  themeId: number;

  @IsNotEmpty()
  @IsNumber()
  categoryId: number;

  @IsNotEmpty()
  @IsNumber()
  subcategoryId: number;

  @IsString()
  description: string;

  @IsString()
  processSEI: string;

  @IsString()
  observations: string;

  @IsString()
  actionPlan: string;

  @IsOptional()
  @IsEnum(DeadlineStatus, {
    message:
      'deadlineStatus must be one of: GRAVE EXPIRADO, NEAR MISS EXPIRADO, NEVER EVENT EXPIRADO, ÓBITO EXPIRADO',
  })
  deadlineStatus: DeadlineStatus;
}
