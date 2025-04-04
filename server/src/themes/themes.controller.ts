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
import { ThemesService } from './themes.service';
import { CreateThemeDto } from './dto/create-theme.dto';
import { UpdateThemeDto } from './dto/update-theme.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaginationQueryDto } from 'src/shared/dto/pagination-query.dto';

@ApiTags('themes')
@Controller('themes')
@UseGuards(AuthGuard('jwt'))
export class ThemesController {
  constructor(private readonly themesService: ThemesService) {}

  @Post()
  @ApiOperation({ summary: 'Criar um novo tema' })
  create(@Body() createThemeDto: CreateThemeDto) {
    return this.themesService.create(createThemeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos os temas (paginado)' })
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.themesService.findAllPaginated(paginationQuery);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar tema por ID' })
  findOne(@Param('id') id: string) {
    return this.themesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar tema por ID' })
  update(@Param('id') id: string, @Body() updateThemeDto: UpdateThemeDto) {
    return this.themesService.update(+id, updateThemeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Remover tema por ID' })
  remove(@Param('id') id: string) {
    return this.themesService.remove(+id);
  }
}
