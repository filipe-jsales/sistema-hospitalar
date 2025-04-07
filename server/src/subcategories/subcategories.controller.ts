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
import { SubcategoriesService } from './subcategories.service';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation } from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/shared/dto/pagination-query.dto';

@Controller('subcategories')
@UseGuards(AuthGuard('jwt'))
export class SubcategoriesController {
  constructor(private readonly subcategoriesService: SubcategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova subcategoria' })
  create(@Body() createSubcategoryDto: CreateSubcategoryDto) {
    return this.subcategoriesService.create(createSubcategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as subcategorias (paginado)' })
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.subcategoriesService.findAllPaginated(paginationQuery);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar subcategoria por ID' })
  findOne(@Param('id') id: string) {
    return this.subcategoriesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar subcategoria por ID' })
  update(
    @Param('id') id: string,
    @Body() updateSubcategoryDto: UpdateSubcategoryDto,
  ) {
    return this.subcategoriesService.update(+id, updateSubcategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover subcategoria por ID' })
  remove(@Param('id') id: string) {
    return this.subcategoriesService.remove(+id);
  }
}
