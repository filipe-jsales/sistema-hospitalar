import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { IncidentsService } from './incidents.service';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { UpdateIncidentDto } from './dto/update-incident.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation } from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/shared/dto/pagination-query.dto';

@Controller('incidents')
@UseGuards(AuthGuard('jwt'))
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo incidente' })
  create(@Body() createIncidentDto: CreateIncidentDto) {
    return this.incidentsService.create(createIncidentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os incidentes (paginado)' })
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.incidentsService.findAllPaginated(paginationQuery);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar incidente por ID' })
  findOne(@Param('id') id: string) {
    return this.incidentsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar incidente por ID' })
  update(
    @Param('id') id: string,
    @Body() updateIncidentDto: UpdateIncidentDto,
  ) {
    return this.incidentsService.update(+id, updateIncidentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover incidente por ID' })
  remove(@Param('id') id: string) {
    return this.incidentsService.remove(+id);
  }
}
