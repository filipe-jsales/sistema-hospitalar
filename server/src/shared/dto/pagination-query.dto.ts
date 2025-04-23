import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, Min, IsArray } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Página atual (começando de 1)',
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Quantidade de itens por página',
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({
    description: 'Filtrar por ano (ex: 2025)',
    example: 2025,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  year?: number;

  @ApiPropertyOptional({
    description: 'Filtrar por meses específicos do ano (1-12)',
    example: [1, 2, 3],
    type: [Number],
  })
  @IsOptional()
  @Transform(({ value }) => {
    return Array.isArray(value) ? value : value ? [value] : [];
  })
  @IsArray()
  @Type(() => Number)
  @IsInt({ each: true })
  months?: number[];

  @ApiPropertyOptional({
    description: 'Filtrar por ID do responsável',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  responsibleId?: number;

  @ApiPropertyOptional({
    description: 'Filtrar por ID da notificação',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  notificationId?: number;

  @ApiPropertyOptional({
    description: 'Filtrar por ID do incidente',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  incidentId?: number;

  @ApiPropertyOptional({
    description: 'Filtrar por ID do serviço notificante',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  notifyingServiceId?: number;

  @ApiPropertyOptional({
    description: 'Filtrar por ID do tema',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  themeId?: number;
}
