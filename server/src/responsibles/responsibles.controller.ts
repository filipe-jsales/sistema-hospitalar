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
import { ResponsiblesService } from './responsibles.service';
import { CreateResponsibleDto } from './dto/create-responsible.dto';
import { UpdateResponsibleDto } from './dto/update-responsible.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation } from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/shared/dto/pagination-query.dto';

@Controller('responsibles')
@UseGuards(AuthGuard('jwt'))
export class ResponsiblesController {
  constructor(private readonly responsiblesService: ResponsiblesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo responsável' })
  create(@Body() createResponsibleDto: CreateResponsibleDto) {
    return this.responsiblesService.create(createResponsibleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as categorias (paginado)' })
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.responsiblesService.findAllPaginated(paginationQuery);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar responsável por ID' })
  findOne(@Param('id') id: string) {
    return this.responsiblesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar responsável por ID' })
  update(
    @Param('id') id: string,
    @Body() updateResponsibleDto: UpdateResponsibleDto,
  ) {
    return this.responsiblesService.update(+id, updateResponsibleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover responsável por ID' })
  remove(@Param('id') id: string) {
    return this.responsiblesService.remove(+id);
  }
}
