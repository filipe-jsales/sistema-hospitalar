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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation } from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/shared/dto/pagination-query.dto';

@Controller('categories')
@UseGuards(AuthGuard('jwt'))
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar uma nova categoria' })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todas as categorias (paginado)' })
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.categoriesService.findAllPaginated(paginationQuery);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar categoria por ID' })
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar categoria por ID' })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover categoria por ID' })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(+id);
  }
}
