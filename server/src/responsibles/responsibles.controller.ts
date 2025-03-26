import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ResponsiblesService } from './responsibles.service';
import { CreateResponsibleDto } from './dto/create-responsible.dto';
import { UpdateResponsibleDto } from './dto/update-responsible.dto';

@Controller('responsibles')
export class ResponsiblesController {
  constructor(private readonly responsiblesService: ResponsiblesService) {}

  @Post()
  create(@Body() createResponsibleDto: CreateResponsibleDto) {
    return this.responsiblesService.create(createResponsibleDto);
  }

  @Get()
  findAll() {
    return this.responsiblesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.responsiblesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateResponsibleDto: UpdateResponsibleDto) {
    return this.responsiblesService.update(+id, updateResponsibleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.responsiblesService.remove(+id);
  }
}
