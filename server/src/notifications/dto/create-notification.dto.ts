import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

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
  @IsString()
  notificationNumber: string;

  @IsNotEmpty()
  @IsNumber()
  organizationalUnityId: number;

  @IsNotEmpty()
  @IsNumber()
  notifyingServiceId: number;

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
}
